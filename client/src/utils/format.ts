export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'smart-home': '#00d4ff',
    agriculture: '#00e676',
    healthcare: '#ff1744',
    automation: '#ffab00',
    robotics: '#0066ff',
    other: '#8892a4',
  };
  return colors[category] || colors.other;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: '#00e676',
    intermediate: '#ffab00',
    advanced: '#ff1744',
  };
  return colors[difficulty] || colors.beginner;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    planning: '#8892a4',
    'in-progress': '#00d4ff',
    completed: '#00e676',
    paused: '#ffab00',
  };
  return colors[status] || colors.planning;
}
