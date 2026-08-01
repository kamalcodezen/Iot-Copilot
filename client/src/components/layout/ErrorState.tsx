import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

// Full-height error state shown when a dashboard page fails to load its data.
// Retry reloads the page, matching the behavior the pages used inline.
export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="h-14 w-14 rounded-2xl bg-error-light flex items-center justify-center mb-4">
        <AlertTriangle size={28} className="text-error" />
      </div>
      <h2 className="text-lg font-bold text-text-primary mb-2">Something went wrong</h2>
      <p className="text-sm font-semibold text-text-tertiary mb-6 max-w-[280px]">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-accent rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15"
      >
        <RefreshCw size={14} />Retry
      </button>
    </div>
  );
}
