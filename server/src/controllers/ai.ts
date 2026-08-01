import { Response } from 'express';
import { AuthRequest, AIRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { AppError } from '../utils/errors';
import { requireUser } from '../utils/request';
import { sendData } from '../utils/response';
import {
  generateContent,
  generateContentStream,
  buildMentorPrompt,
  buildDebugPrompt,
  buildInterviewPrompt,
  buildInterviewFeedbackPrompt,
  buildRoadmapPrompt,
  buildComponentPrompt,
  buildProjectPlanPrompt,
  buildRecommendPrompt,
  buildAssistantPrompt,
} from '../services/ai';
import { detectLanguage } from '../services/language';
import { saveMemory, getRecentMemory, getMemoryByType, buildContextString } from '../services/memory';
import { getUserById, markUserActive, addUserStat } from '../services/user';
import Activity from '../models/Activity';
import LearningPath from '../models/LearningPath';

// --- Server-Sent Events helpers -------------------------------------------------

function setupSSE(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
}

function writeToken(res: Response, token: string) {
  res.write(`event: token\ndata: ${JSON.stringify({ token })}\n\n`);
}

function writeSSEDone(res: Response, full: string) {
  res.write(`event: done\ndata: ${JSON.stringify({ full })}\n\n`);
  res.end();
}

function writeSSEError(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  res.write(`event: error\ndata: ${JSON.stringify({ error: message })}\n\n`);
  res.end();
}

// Streams the model's reply to the client token by token.
// If streaming fails with a typed AI error (quota, config, provider), the
// error propagates so the caller reports it — retrying would waste quota.
// Any other failure falls back to a single non-streamed call.
async function streamReply(res: Response, prompt: string): Promise<string> {
  let fullResponse = '';
  try {
    for await (const chunk of generateContentStream(prompt)) {
      fullResponse += chunk;
      writeToken(res, chunk);
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    fullResponse = await generateContent(prompt);
    writeToken(res, fullResponse);
  }
  return fullResponse;
}

// Parses the JSON array the model returns for roadmaps. Falls back to a single
// "IoT Fundamentals" module when the model replies with plain text instead.
function parseRoadmapModules(response: string) {
  try {
    return JSON.parse(response.replace(/```json|```/g, '').trim());
  } catch {
    return [{ title: 'IoT Fundamentals', description: response, order: 1, resources: [], estimatedHours: 5 }];
  }
}

// --- Streaming chat handlers ----------------------------------------------------

export const aiChat = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId } = requireUser(req);
    const { message, context, projectId } = req.body as AIRequest;

    const user = await getUserById(userId);
    const recentMemory = await getRecentMemory(userId, 10);
    const prompt = buildMentorPrompt(message, user?.skillLevel || 'beginner', buildContextString(recentMemory));

    await saveMemory(userId, 'mentor', 'user', message, { topic: context, projectId });
    setupSSE(res);

    const fullResponse = await streamReply(res, prompt);

    await saveMemory(userId, 'mentor', 'assistant', fullResponse, { topic: context });
    await markUserActive(userId);
    await addUserStat(userId, 'totalSessions', 1);
    await addUserStat(userId, 'totalHours', 0.1);
    await Activity.create({ userId, type: 'mentor_session', description: 'Asked AI Mentor a question' });

    writeSSEDone(res, fullResponse);
  } catch (error) {
    writeSSEError(res, error);
  }
};

export const aiDebug = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId } = requireUser(req);
    const { message, board, components, error } = req.body as AIRequest;

    const prompt = buildDebugPrompt(
      message || '',
      board || '',
      (components || []).join(', '),
      error || ''
    );

    setupSSE(res);
    const fullResponse = await streamReply(res, prompt);

    await saveMemory(userId, 'debug', 'assistant', fullResponse, { topic: 'debug_session' });
    await Activity.create({ userId, type: 'debug_session', description: 'Used AI Debugger' });

    writeSSEDone(res, fullResponse);
  } catch (error) {
    writeSSEError(res, error);
  }
};

export const assistantChat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, page, pageInfo } = req.body as AIRequest;
    const userId = req.user?.id;

    let history = '';
    if (userId) {
      const recentMemory = await getRecentMemory(userId, 6);
      history = buildContextString(recentMemory);
    }

    const { language } = detectLanguage(message);
    const prompt = buildAssistantPrompt(message, page || '', pageInfo || '', history, language);

    if (userId) {
      await saveMemory(userId, 'mentor', 'user', message, { topic: 'assistant' });
    }

    setupSSE(res);
    let fullResponse = await streamReply(res, prompt);

    // The model occasionally returns an empty reply on the first attempt.
    if (!fullResponse.trim()) {
      fullResponse = await generateContent(prompt);
      writeToken(res, fullResponse);
    }

    if (!fullResponse.trim()) {
      writeSSEError(res, new Error('The AI service returned an empty response. Please try again.'));
      return;
    }

    if (userId) {
      await saveMemory(userId, 'mentor', 'assistant', fullResponse, { topic: 'assistant' });
      await Activity.create({
        userId,
        type: 'mentor_session',
        description: `Asked AI Copilot on ${page || 'unknown page'}`,
      });
    }

    writeSSEDone(res, fullResponse);
  } catch (error) {
    writeSSEError(res, error);
  }
};

// --- Plain JSON handlers --------------------------------------------------------

export const getChatHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const memories = await getMemoryByType(userId, 'mentor', 50);
  sendData(res, memories);
});

export const generateRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { skillLevel, goals } = req.body as AIRequest;

  const prompt = buildRoadmapPrompt(skillLevel || 'beginner', goals || '');
  const response = await generateContent(prompt);
  const modules = parseRoadmapModules(response);

  const learningPath = await LearningPath.create({
    userId,
    title: `IoT ${skillLevel || 'Beginner'} Roadmap`,
    description: goals || 'Complete IoT learning journey',
    level: skillLevel || 'beginner',
    modules,
    isActive: true,
  });

  await saveMemory(userId, 'roadmap', 'assistant', JSON.stringify(modules), { topic: 'roadmap' });
  await Activity.create({
    userId,
    type: 'roadmap_started',
    description: `Generated ${skillLevel || 'beginner'} learning roadmap`,
  });

  sendData(res, learningPath);
});

export const recommendComponents = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { project, budget } = req.body as AIRequest;

  const response = await generateContent(buildComponentPrompt(project || '', budget || ''));
  await saveMemory(userId, 'recommendation', 'assistant', response, { topic: 'component_recommendation' });

  sendData(res, response);
});

export const planProject = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { idea, skillLevel } = req.body as AIRequest;

  const response = await generateContent(buildProjectPlanPrompt(idea || '', skillLevel || 'beginner'));
  await saveMemory(userId, 'mentor', 'assistant', response, { topic: 'project_plan' });

  sendData(res, response);
});

export const interviewQuestions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { experienceLevel, topic } = req.body as AIRequest;

  const response = await generateContent(buildInterviewPrompt(experienceLevel || 'fresher', topic || 'General IoT'));
  await saveMemory(userId, 'interview', 'assistant', response, { topic: 'interview_questions' });

  sendData(res, response);
});

export const submitInterviewAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);
  const { question, answer, experienceLevel } = req.body as AIRequest;

  const response = await generateContent(buildInterviewFeedbackPrompt(question || '', answer || '', experienceLevel || 'fresher'));
  await saveMemory(userId, 'interview', 'assistant', response, { topic: 'interview_feedback' });
  await Activity.create({ userId, type: 'interview_practice', description: 'Practiced interview question' });

  sendData(res, response);
});

export const recommendNext = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id: userId } = requireUser(req);

  const recentMemories = await getRecentMemory(userId, 20);
  const user = await getUserById(userId);
  const prompt = buildRecommendPrompt(buildContextString(recentMemories), user?.skillLevel || 'beginner');
  const response = await generateContent(prompt);

  sendData(res, response);
});
