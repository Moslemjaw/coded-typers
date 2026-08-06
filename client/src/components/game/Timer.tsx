import React from 'react';

// ============================================================
// Timer — Circular SVG countdown timer
// ============================================================

interface TimerProps {
  duration: number;
  timeRemaining: number;
  size?: 'sm' | 'lg';
}

export function Timer({ duration, timeRemaining, size = 'lg' }: TimerProps) {
  const percentage = duration > 0 ? (timeRemaining / duration) * 100 : 0;
  const dim = size === 'lg' ? 100 : 60;
  const strokeWidth = size === 'lg' ? 6 : 4;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  // Color changes based on remaining time
  let color = 'text-primary-500';
  if (percentage < 30) color = 'text-yellow-500';
  if (percentage < 10) color = 'text-red-500';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: dim, height: dim }}>
      <svg className="transform -rotate-90" width={dim} height={dim}>
        {/* Background circle */}
        <circle
          cx={dim / 2} cy={dim / 2} r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-surface-200 dark:text-dark-border"
        />
        {/* Progress circle */}
        <circle
          cx={dim / 2} cy={dim / 2} r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`${color} transition-all duration-1000 ease-linear`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {/* Time text */}
      <span className={`absolute font-bold ${size === 'lg' ? 'text-xl' : 'text-sm'} text-surface-900 dark:text-white`}>
        {timeRemaining}
      </span>
    </div>
  );
}
