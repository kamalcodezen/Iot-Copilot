export interface PageContext {
  name: string;
  context: string;
}

const FALLBACK: PageContext = {
  name: 'IoT Copilot',
  context: 'The user is browsing the IoT Copilot platform. It offers AI-powered IoT learning: an AI Mentor chat, an AI Debugger for hardware/code issues, learning roadmaps, an interview coach, a project builder, and a community showcase.',
};

const PAGES: Array<{ match: (path: string) => boolean; page: PageContext }> = [
  {
    match: (p) => p === '/',
    page: {
      name: 'Home',
      context: 'The landing page. It presents IoT Copilot as an AI-first IoT learning platform with sections for benefits, features, solutions, industries, statistics, popular projects, learning roadmap preview, testimonials, and FAQ.',
    },
  },
  {
    match: (p) => p === '/dashboard',
    page: {
      name: 'Dashboard',
      context: 'The user dashboard showing AI-powered statistics, recent projects, activity, and quick actions to start new projects or learning paths.',
    },
  },
  {
    match: (p) => p.startsWith('/projects'),
    page: {
      name: 'Project Builder',
      context: 'The project builder where users create, edit, and track IoT projects with status, difficulty, and components. There is a project planner AI feature that turns an idea into a full build plan.',
    },
  },
  {
    match: (p) => p.startsWith('/learning-path'),
    page: {
      name: 'Learning Roadmap',
      context: 'The learning path page showing the user\'s AI-generated IoT learning roadmap modules, their progress, and resources.',
    },
  },
  {
    match: (p) => p.startsWith('/ai-mentor'),
    page: {
      name: 'AI Mentor',
      context: 'The AI Mentor chat page where users ask any IoT, Arduino, ESP32, sensor, or electronics question and receive streamed answers.',
    },
  },
  {
    match: (p) => p.startsWith('/ai-debugger'),
    page: {
      name: 'AI Debugger',
      context: 'The AI Debugger page where users describe hardware or code problems (board, components, error messages) and get a structured debugging analysis.',
    },
  },
  {
    match: (p) => p.startsWith('/interview-coach'),
    page: {
      name: 'Interview Coach',
      context: 'The IoT interview practice page with generated interview questions by experience level and AI feedback on submitted answers.',
    },
  },
  {
    match: (p) => p.startsWith('/community'),
    page: {
      name: 'Community',
      context: 'The community page showcasing public IoT projects from other learners, with filtering by difficulty and category.',
    },
  },
  {
    match: (p) => p.startsWith('/explore'),
    page: {
      name: 'Explore',
      context: 'The explore page with curated IoT learning resources and content.',
    },
  },
  {
    match: (p) => p.startsWith('/profile'),
    page: {
      name: 'Profile',
      context: 'The user profile page with account details, skill level, and personal statistics.',
    },
  },
  {
    match: (p) => p.startsWith('/settings'),
    page: {
      name: 'Settings',
      context: 'The settings page where users manage account preferences.',
    },
  },
  {
    match: (p) => p.startsWith('/auth'),
    page: {
      name: 'Authentication',
      context: 'The login/registration pages. The user may not be signed in yet.',
    },
  },
  {
    match: (p) => p.startsWith('/admin'),
    page: {
      name: 'Admin Panel',
      context: 'The admin panel for managing users and reports.',
    },
  },
];

export const getPageContext = (pathname: string): PageContext => {
  const match = PAGES.find((entry) => entry.match(pathname));
  return match ? match.page : FALLBACK;
};
