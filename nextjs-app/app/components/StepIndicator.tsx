'use client';

interface StepIndicatorProps {
  steps: string[];
  current: number;
}

export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  const pct = steps.length > 1 ? (current - 1) / (steps.length - 1) : 0;
  return (
    <div className="mb-6">
      <div className="relative h-2 bg-gray-300 dark:bg-gray-700 rounded">
        <div
          className="absolute top-0 left-0 h-2 bg-blue-600 dark:bg-blue-400 rounded transition-all"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs">
        {steps.map((label, idx) => (
          <div key={label} className="flex-1 text-center">
            <div
              className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-semibold ${
                idx + 1 === current
                  ? 'bg-blue-600 dark:bg-blue-400 text-white'
                  : idx + 1 < current
                  ? 'bg-blue-600 dark:bg-blue-400 text-white opacity-70'
                  : 'bg-gray-400 dark:bg-gray-600 text-white'
              }`}
            >
              {idx + 1}
            </div>
            <span className="mt-1 block leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
