'use client';
interface StepIndicatorProps {
  steps: string[];
  current: number;
}
export default function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex justify-between mb-4">
      {steps.map((label, idx) => (
        <div key={label} className="flex flex-col items-center flex-1">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              idx + 1 <= current ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}
          >
            {idx + 1}
          </div>
          <span className="text-xs mt-1 text-center">{label}</span>
        </div>
      ))}
    </div>
  );
}
