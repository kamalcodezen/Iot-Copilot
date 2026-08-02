# 07. AI System

## Purpose
This document explains the integration, prompt flow, and streaming architecture for the Google Gemini AI features.

## When to read
Read this when you need to modify the AI Mentor behavior, change the system prompts, or debug Server-Sent Event (SSE) streaming issues.

## Related documents
- [05. API](./05_API.md)

## Table of Contents
- [1. Core Service Integration](#1-core-service-integration-serversrcservicesaits)
- [2. AI Chat / Mentor](#2-ai-chat--mentor-ai-mentor)
- [3. AI Debugger](#3-ai-debugger-ai-debugger)
- [4. AI Project Planner](#4-ai-project-planner)
- [5. AI Interview Coach](#5-ai-interview-coach)
- [6. AI Learning Roadmap](#6-ai-learning-roadmap)

## Main Content

IoT Copilot's intelligence is powered by the Google Generative AI SDK, specifically utilizing the `gemini-2.5-flash` model for high-speed, cost-effective reasoning.

### 1. Core Service Integration (`server/src/services/ai.ts`)
The entire AI implementation is abstracted into a single service file to prevent business logic from leaking into controllers.
- **Model Selection:** `gemini-2.5-flash` is hardcoded as the default model due to its generous free tier and fast inference time, making it ideal for streaming chat responses.
- **Error Handling (429 Quota Exceeded):** The service implements a `withRetry` wrapper that intercepts rate-limit errors. If a `429` is thrown, the system delays exponentially and retries. If the ultimate failure is reached, it throws a parsed, user-friendly error rather than a raw API trace.
- **System Instructions:** Every AI method injects a "System Prompt" (e.g., "You are an expert IoT Engineer...") before appending the user's prompt.

### 2. AI Chat / Mentor (`/ai-mentor`)
- **Purpose:** Acts as a pair-programming partner for hardware and software.
- **Flow:**
  - Client sends an array of messages (`{ role: 'user', content: '...' }`).
  - Server formats this into a Gemini `Content` array.
  - Server calls `model.generateContentStream()`.
  - The Express response object streams the raw text chunks back to the client.
- **Client Handling:** `lib/api/ai-stream.ts` uses the native `ReadableStream` to append chunks to the UI state instantly.

### 3. AI Debugger (`/ai-debugger`)
- **Purpose:** Analyzes stack traces, compiler errors (e.g., Arduino IDE), or sensor logs.
- **Flow:**
  - User pasted a log and optionally a code snippet.
  - Server prompts Gemini to identify the root cause and provide a specific code fix.
  - Returns a structured JSON response (not streamed) since the user needs to see the final, formatted diagnosis.

### 4. AI Project Planner
- **Purpose:** Generates a complete project architecture based on a simple user prompt (e.g., "Smart Garden").
- **Flow:**
  - Prompts Gemini to return a JSON object containing `title`, `description`, `architecture` (MCU, sensors), and `milestones`.
  - The server parses the JSON and directly inserts it into the MongoDB `Project` collection.

### 5. AI Interview Coach
- **Purpose:** Simulates technical interviews for IoT roles.
- **Implementation:** Functions similarly to the Chat Mentor but with a strict system prompt instructing the AI to ask questions one at a time, evaluate the user's answer, and rate their technical accuracy.

### 6. AI Learning Roadmap
- **Purpose:** Generates a personalized curriculum based on the user's current knowledge.
- **Implementation:** Evaluates the user's `Activity` history and outputs a JSON tree of modules.

## Related Source Code
- `server/src/services/ai.ts`
- `client/src/lib/api/ai-stream.ts`

## Last Updated
2026-08-02
