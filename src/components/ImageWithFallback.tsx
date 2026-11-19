import {useState} from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel: string;
  aspectClassName?: string;
  loading?: 'eager' | 'lazy';
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackLabel,
  aspectClassName = 'aspect-video',
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-panel border border-line text-muted p-6 text-center ${aspectClassName} ${className}`}
      >
        <span className="font-mono text-xs tracking-wide text-faint mb-1.5">
          Studio Visual
        </span>
        <span className="font-display text-sm font-medium text-cream max-w-xs">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
