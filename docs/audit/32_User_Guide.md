# User Guide: IoT Copilot AI

Welcome to IoT Copilot! This platform is designed to be your personal Senior Embedded Engineer. Whether you are blinking your first LED or designing a complex MQTT sensor network, this guide will help you get the most out of the platform.

---

## 1. Getting Started

1. **Sign Up:** Navigate to the platform URL and create an account using your Google login.
2. **Setup your Profile:** Go to `/profile` and set your current skill level (Beginner, Intermediate, Advanced). This is crucial! The AI reads this setting to adjust how it speaks to you. If you are a beginner, it will explain basic concepts (like what a resistor does). If you are advanced, it will skip the basics and jump straight to the code.

## 2. Using the Global AI Assistant

You'll notice a floating button in the bottom right corner of your screen at all times. This is your Copilot.
- Click it to open the chat drawer.
- **Context Awareness:** The Copilot knows what page you are on. If you are viewing a specific project and click the button, you don't need to say "Can you explain the code for Project X?". Just ask "How does this sensor work?" and the Copilot will automatically read the code you are currently looking at.

## 3. Planning a Project

Have an idea but don't know where to start?
1. Go to **Projects > New Project**.
2. Instead of writing the code yourself, click **"Plan with AI"**.
3. Describe your idea (e.g., "I want to build a smart plant monitor that tweets me when it needs water").
4. The AI will generate a complete Project Plan. It will tell you exactly what board to buy (e.g., an ESP8266 for WiFi capabilities), what sensors you need, and provide the starter C++ code.
5. Save the project to your Dashboard.

## 4. Debugging Hardware & Code

Hardware debugging is frustrating. If your circuit isn't working:
1. Navigate to the **AI Debugger** (`/ai-debugger`).
2. Fill out the quick form. Tell the AI what board you are using, what sensors are plugged in, and what the error is (e.g., "The serial monitor just prints garbage text").
3. The AI will launch a diagnostic session. It will walk you through a step-by-step troubleshooting tree. It might ask you to check your baud rate first, then ask you to verify your RX/TX wiring, and finally check your power supply voltage. 

## 5. Learning Paths

If you want structured learning instead of building random projects:
1. Go to **Learning Paths**.
2. Enter your goal (e.g., "I want to learn how to use MQTT to connect Arduinos to AWS").
3. The AI will generate a custom 5-module curriculum for you. 
4. As you read the materials and practice the code, mark modules as "Complete" to track your progress on your Dashboard.

## 6. Interview Prep

Preparing for a job as an Embedded Systems Engineer?
1. Go to the **Interview Coach** (`/interview-coach`).
2. Select a topic (e.g., "C++ Memory Management" or "I2C Protocols").
3. The AI will ask you a technical question.
4. Type your answer to the best of your ability.
5. The AI will grade your answer out of 10 and explain exactly what you missed, helping you refine your technical communication skills.

## 7. Community

Want to see what others are building?
1. Go to the **Community** tab.
2. Browse public projects. 
3. If you see something cool, you can copy the code, check out their circuit diagrams, and leave a comment asking the creator questions. 
4. Don't forget to make your own successful projects Public so others can learn from you!
