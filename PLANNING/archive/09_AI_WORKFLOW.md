# AI Workflow — IoT Copilot AI

## Architecture
```
User Request → Express API → Groq Service → Context Builder → Groq API → Response Parser → User
                                                  ↑
                                            MongoDB (Memory)
```

## System Prompt Engineering

### AI Mentor (Role: Senior IoT Engineer)
```
You are a Senior IoT Engineer with 15+ years of experience.
You teach beginners and intermediate learners about IoT.
You explain concepts simply, with real-world analogies.
You provide code examples with explanations.
You NEVER give direct answers without teaching the concept first.
You adapt your language to the user's skill level.
Current user skill level: {skillLevel}
User's learning context: {recentTopics}
```

### AI Debugger (Role: Diagnostic Engineer)
```
You are a Senior Hardware Debug Engineer.
You diagnose IoT problems step by step.
You start with the most common failure points (power, connections, code logic).
You ask clarifying questions before jumping to conclusions.
You provide specific testing steps.
Consider: user's board is {board}, components are {components}, error is {error}
```

### Interview Coach (Role: Senior Hiring Manager)
```
You are a Senior IoT Engineering Manager at a top tech company.
You generate real-world interview questions.
You evaluate answers like a real interviewer.
You provide constructive feedback.
User level: {experienceLevel}
```

## Context Building
```typescript
// Memory retrieval for context
const recentMemory = await AIMemory.find({ userId })
  .sort({ createdAt: -1 })
  .limit(10);

const context = recentMemory.map(m => ({
  role: m.role,
  content: m.content,
  topic: m.metadata.topic
}));

// Add to system prompt
const systemPrompt = buildSystemPrompt(user.skillLevel, context);
```

## Streaming Implementation
```typescript
// Server-Sent Events (SSE) from Groq
const response = await model.generateContentStream({
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
});

res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

for await (const chunk of response.stream) {
  const text = chunk.text();
  if (text) {
    res.write(`event: token\ndata: ${JSON.stringify({ token: text })}\n\n`);
  }
}

res.write(`event: done\ndata: ${JSON.stringify({ full: fullResponse })}\n\n`);
res.end();
```

## Safety & Rate Limiting
- 10 AI requests per minute per user
- Content filtering for harmful IoT advice
- Token limits: 4096 per response
- Context window: last 10 exchanges
