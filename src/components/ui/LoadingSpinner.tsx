'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LoadingSpinner({ 
  size = 'md',
  color = 'indigo'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-${color}-600`}
        role="status"
        aria-label="読み込み中"
      >
        <span className="sr-only">読み込み中...</span>
      </div>
    </div>
  );
}