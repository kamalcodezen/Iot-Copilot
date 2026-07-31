export interface Activity {
  _id: string;
  userId: string;
  type: string;
  description: string;
  metadata: {
    projectId?: string;
    badgeName?: string;
    sessionDuration?: number;
  };
  createdAt: string;
}

export interface StatsData {
  stats: {
    totalProjects: number;
    completedProjects: number;
    learningStreak: number;
    totalSessions: number;
    totalHours: number;
    lastActive: string;
  };
  totals: {
    totalProjects: number;
    completedProjects: number;
    inProgressProjects: number;
  };
  dailyActivity: Array<{ date: string; count: number }>;
}
