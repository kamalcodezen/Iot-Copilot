# Project Folder Structure — IoT Copilot AI

```
iot-copilot/
├── PLANNING/
│   ├── 01_PRODUCT_VISION.md
│   ├── 02_PRD.md
│   ├── 03_USER_FLOW.md
│   ├── 04_INFORMATION_ARCHITECTURE.md
│   ├── 05_DATABASE_SCHEMA.md
│   ├── 06_FOLDER_STRUCTURE.md
│   ├── 07_API_ARCHITECTURE.md
│   ├── 08_UI_UX_PLANNING.md
│   ├── 09_AI_WORKFLOW.md
│   └── 10_DEV_ROADMAP.md
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   ├── env.ts
│   │   │   └── cloudinary.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Project.ts
│   │   │   ├── AIMemory.ts
│   │   │   ├── LearningPath.ts
│   │   │   ├── Activity.ts
│   │   │   └── Comment.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── project.ts
│   │   │   ├── ai.ts
│   │   │   ├── learningPath.ts
│   │   │   ├── activity.ts
│   │   │   ├── community.ts
│   │   │   └── admin.ts
│   │   ├── controllers/
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── project.ts
│   │   │   ├── ai.ts
│   │   │   ├── learningPath.ts
│   │   │   ├── activity.ts
│   │   │   ├── community.ts
│   │   │   └── admin.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── admin.ts
│   │   │   ├── validate.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── errorHandler.ts
│   │   ├── services/
│   │   │   ├── Groq.ts
│   │   │   ├── cloudinary.ts
│   │   │   ├── email.ts
│   │   │   └── memory.ts
│   │   ├── utils/
│   │   │   ├── helpers.ts
│   │   │   ├── constants.ts
│   │   │   └── logger.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (Landing)
│   │   │   ├── globals.css
│   │   │   ├── not-found.tsx
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── ai-mentor/page.tsx
│   │   │   ├── learning-path/page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── explore/page.tsx
│   │   │   ├── ai-debugger/page.tsx
│   │   │   ├── interview-coach/page.tsx
│   │   │   ├── community/page.tsx
│   │   │   ├── profile/[id]/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── users/page.tsx
│   │   │       └── reports/page.tsx
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Spinner.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── Avatar.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   ├── landing/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── Features.tsx
│   │   │   │   ├── HowItWorks.tsx
│   │   │   │   ├── AIFeatures.tsx
│   │   │   │   ├── PopularProjects.tsx
│   │   │   │   ├── RoadmapPreview.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   ├── FAQ.tsx
│   │   │   │   └── CTA.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsBar.tsx
│   │   │   │   ├── ProgressChart.tsx
│   │   │   │   ├── RecentActivity.tsx
│   │   │   │   ├── AISuggestions.tsx
│   │   │   │   ├── ProjectProgress.tsx
│   │   │   │   └── SkillRadar.tsx
│   │   │   ├── ai/
│   │   │   │   ├── ChatContainer.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── CodeBlock.tsx
│   │   │   │   ├── SuggestedQuestions.tsx
│   │   │   │   └── MemoryIndicator.tsx
│   │   │   └── projects/
│   │   │       ├── ProjectCard.tsx
│   │   │       ├── ProjectForm.tsx
│   │   │       ├── ProjectFilters.tsx
│   │   │       └── ProjectTimeline.tsx
│   │   ├── lib/
│   │   │   ├── axios.ts (axios instance)
│   │   │   ├── utils.ts (cn, formatters)
│   │   │   └── validations.ts (zod schemas)
│   │   ├── services/
│   │   │   ├── auth.ts
│   │   │   ├── project.ts
│   │   │   ├── ai.ts
│   │   │   ├── user.ts
│   │   │   └── community.ts
│   │   ├── store/
│   │   │   ├── authStore.ts
│   │   │   ├── uiStore.ts
│   │   │   └── aiStore.ts
│   │   └── types/
│   │       └── index.ts
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   ├── .env.example
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── postcss.config.js
│
├── .gitignore
└── README.md
```
