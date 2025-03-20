'use client';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index < currentStep
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : index === currentStep
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-20 h-0.5 ${
                  index < currentStep
                    ? 'bg-indigo-600'
                    : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-xs font-medium ${
              index <= currentStep
                ? 'text-indigo-600'
                : 'text-gray-500'
            }`}
            style={{ width: '80px', textAlign: 'center' }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}