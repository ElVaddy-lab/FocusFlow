interface TimerProgressRingProps {
  children: React.ReactNode;
  progress: number;
}

export function TimerProgressRing({
  children,
  progress
}: TimerProgressRingProps) {
  const radius = 108;
  const strokeWidth = 12;
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - normalizedProgress);

  return (
    <div className="relative mx-auto grid aspect-square w-full max-w-[280px] place-items-center">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 240 240"
      >
        <circle
          className="stroke-zinc-200 dark:stroke-zinc-800"
          cx="120"
          cy="120"
          fill="none"
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="stroke-teal-600 transition-[stroke-dashoffset] duration-500 ease-linear dark:stroke-teal-400"
          cx="120"
          cy="120"
          fill="none"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>
      <div className="relative z-10 text-center">{children}</div>
    </div>
  );
}
