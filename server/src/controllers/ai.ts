import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest, AIRequest } from '../types';
import { asyncHandler } from '../middlewares/asyncHandler';
import { generateContent, generateContentStream } from '../services/ai';
import { detectLanguage } from '../services/language';
import { saveMemory, getRecentMemory, getMemoryByType, buildContextString } from '../services/memory';
import Activity from '../models/Activity';
import {
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
import LearningPath from '../models/LearningPath';

export const aiChat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, context, projectId } = req.body as AIRequest;
    const userCol = mongoose.connection.db?.collection('user');
    const user = userCol ? await userCol.findOne({ id: req.user!.id }) : null;

    const recentMemory = await getRecentMemory(req.user!.id, 10);
    const contextStr = buildContextString(recentMemory);
    const prompt = buildMentorPrompt(message, user?.skillLevel || 'beginner', contextStr);

    await saveMemory(req.user!.id, 'mentor', 'user', message, { topic: context, projectId });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let fullResponse = '';

    try {
      for await (const chunk of generateContentStream(prompt)) {
        fullResponse += chunk;
        res.write(`event: token\ndata: ${JSON.stringify({ token: chunk })}\n\n`);
      }
    } catch (streamError) {
      fullResponse = await generateContent(prompt);
      res.write(`event: token\ndata: ${JSON.stringify({ token: fullResponse })}\n\n`);
    }

    await saveMemory(req.user!.id, 'mentor', 'assistant', fullResponse, { topic: context });

    await mongoose.connection.db?.collection('user').updateOne(
      { id: req.user!.id },
      { $inc: { totalSessions: 1, totalHours: 0.1 }, $set: { lastActive: new Date() } }
    );

    await Activity.create({
      userId: req.user!.id,
      type: 'mentor_session',
      description: 'Asked AI Mentor a question',
    });

    res.write(`event: done\ndata: ${JSON.stringify({ full: fullResponse })}\n\n`);
    res.end();
  } catch (error: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

export const getChatHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const memories = await getMemoryByType(req.user!.id, 'mentor', 50);
    res.json({ success: true, data: memories });
});

export const generateRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { skillLevel, goals } = req.body;
    const prompt = buildRoadmapPrompt(skillLevel || 'beginner', goals || '');
    const response = await generateContent(prompt);

    let modules;
    try {
      modules = JSON.parse(response.replace(/```json|```/g, '').trim());
    } catch {
      modules = [{ title: 'IoT Fundamentals', description: response, order: 1, resources: [], estimatedHours: 5 }];
    }

    const learningPath = await LearningPath.create({
      userId: req.user!.id,
      title: `IoT ${skillLevel || 'Beginner'} Roadmap`,
      description: goals || 'Complete IoT learning journey',
      level: skillLevel || 'beginner',
      modules,
      isActive: true,
    });

    await saveMemory(req.user!.id, 'roadmap', 'assistant', JSON.stringify(modules), { topic: 'roadmap' });

    await Activity.create({
      userId: req.user!.id,
      type: 'roadmap_started',
      description: `Generated ${skillLevel || 'beginner'} learning roadmap`,
    });

    res.json({ success: true, data: learningPath });
});

export const recommendComponents = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { project, budget } = req.body;
    const prompt = buildComponentPrompt(project, budget);
    const response = await generateContent(prompt);

    await saveMemory(req.user!.id, 'recommendation', 'assistant', response, {
      topic: 'component_recommendation',
    });

    res.json({ success: true, data: response });
});

export const planProject = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { idea, skillLevel } = req.body;
    const prompt = buildProjectPlanPrompt(idea, skillLevel || 'beginner');
    const response = await generateContent(prompt);

    await saveMemory(req.user!.id, 'mentor', 'assistant', response, {
      topic: 'project_plan',
    });

    res.json({ success: true, data: response });
});

export const aiDebug = async (req: AuthRequest, res: Response) => {
  try {
    const { message, board, components, error } = req.body as AIRequest;
    const prompt = buildDebugPrompt(
      message || '',
      board || '',
      (components || []).join(', '),
      error || ''
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let fullResponse = '';

    try {
      for await (const chunk of generateContentStream(prompt)) {
        fullResponse += chunk;
        res.write(`event: token\ndata: ${JSON.stringify({ token: chunk })}\n\n`);
      }
    } catch {
      fullResponse = await generateContent(prompt);
      res.write(`event: token\ndata: ${JSON.stringify({ token: fullResponse })}\n\n`);
    }

    await saveMemory(req.user!.id, 'debug', 'assistant', fullResponse, {
      topic: 'debug_session',
    });

    await Activity.create({
      userId: req.user!.id,
      type: 'debug_session',
      description: 'Used AI Debugger',
    });

    res.write(`event: done\ndata: ${JSON.stringify({ full: fullResponse })}\n\n`);
    res.end();
  } catch (error: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

export const interviewQuestions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { experienceLevel, topic } = req.body;
    const prompt = buildInterviewPrompt(experienceLevel || 'fresher', topic || 'General IoT');
    const response = await generateContent(prompt);

    await saveMemory(req.user!.id, 'interview', 'assistant', response, {
      topic: 'interview_questions',
    });

    res.json({ success: true, data: response });
});

export const submitInterviewAnswer = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { question, answer, experienceLevel } = req.body;
    const prompt = buildInterviewFeedbackPrompt(question, answer, experienceLevel || 'fresher');
    const response = await generateContent(prompt);

    await saveMemory(req.user!.id, 'interview', 'assistant', response, {
      topic: 'interview_feedback',
    });

    await Activity.create({
      userId: req.user!.id,
      type: 'interview_practice',
      description: 'Practiced interview question',
    });

    res.json({ success: true, data: response });
});

export const recommendNext = asyncHandler(async (req: AuthRequest, res: Response) => {
    const recentMemories = await getRecentMemory(req.user!.id, 20);
    const history = buildContextString(recentMemories);
    const userCol = mongoose.connection.db?.collection('user');
    const user = userCol ? await userCol.findOne({ id: req.user!.id }) : null;

    const prompt = buildRecommendPrompt(history, user?.skillLevel || 'beginner');
    const response = await generateContent(prompt);

    res.json({ success: true, data: response });
});

export const assistantChat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, page, pageInfo } = req.body as { message: string; page?: string; pageInfo?: string };
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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    let fullResponse = '';

    try {
      for await (const chunk of generateContentStream(prompt)) {
        fullResponse += chunk;
        res.write(`event: token\ndata: ${JSON.stringify({ token: chunk })}\n\n`);
      }
    } catch (streamError) {
      fullResponse = await generateContent(prompt);
      res.write(`event: token\ndata: ${JSON.stringify({ token: fullResponse })}\n\n`);
    }

    if (!fullResponse.trim()) {
      fullResponse = await generateContent(prompt);
      res.write(`event: token\ndata: ${JSON.stringify({ token: fullResponse })}\n\n`);
    }

    if (!fullResponse.trim()) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'The AI service returned an empty response. Please try again.' })}\n\n`);
      res.end();
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

    res.write(`event: done\ndata: ${JSON.stringify({ full: fullResponse })}\n\n`);
    res.end();
  } catch (error: any) {
    res.write(`event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};
