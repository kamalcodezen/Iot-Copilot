import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

// Standard page title block used at the top of dashboard pages: an icon in a
// gradient tile next to the page title and subtitle.
export default function PageHeader({ icon: Icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-blue-500/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">{title}</h1>
        <p className="text-sm font-semibold text-text-tertiary">{subtitle}</p>
      </div>
    </div>
  );
}
