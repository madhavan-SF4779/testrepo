import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number; // 0 to 100
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800", className)}>
      <div
        className="h-full bg-blue-600 transition-all duration-500 ease-in-out dark:bg-blue-500"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
