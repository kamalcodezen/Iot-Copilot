import { Router } from 'express';
import {
  aiChat,
  getChatHistory,
  generateRoadmap,
  recommendComponents,
  planProject,
  aiDebug,
  interviewQuestions,
  submitInterviewAnswer,
  recommendNext,
  assistantChat,
} from '../controllers/ai';
import { authenticate, optionalAuth } from '../middlewares/auth';
import { aiRateLimit } from '../middlewares/rateLimit';
import { validate } from '../middlewares/validate';
import {
  aiChatSchema,
  generateRoadmapSchema,
  recommendComponentsSchema,
  planProjectSchema,
  aiDebugSchema,
  interviewQuestionsSchema,
  submitInterviewAnswerSchema,
  assistantChatSchema,
} from "../validators";

const router = Router();

router.post('/chat', authenticate, aiRateLimit, validate({ body: aiChatSchema }), aiChat);
router.get('/chat/history', authenticate, getChatHistory);
router.post('/roadmap', authenticate, aiRateLimit, validate({ body: generateRoadmapSchema }), generateRoadmap);
router.post('/recommend-components', authenticate, aiRateLimit, validate({ body: recommendComponentsSchema }), recommendComponents);
router.post('/plan-project', authenticate, aiRateLimit, validate({ body: planProjectSchema }), planProject);
router.post('/debug', authenticate, aiRateLimit, validate({ body: aiDebugSchema }), aiDebug);
router.post('/interview', authenticate, aiRateLimit, validate({ body: interviewQuestionsSchema }), interviewQuestions);
router.post('/interview/submit', authenticate, aiRateLimit, validate({ body: submitInterviewAnswerSchema }), submitInterviewAnswer);
router.get('/recommend', authenticate, aiRateLimit, recommendNext);
router.post('/assistant', optionalAuth, aiRateLimit, validate({ body: assistantChatSchema }), assistantChat);

export default router;
