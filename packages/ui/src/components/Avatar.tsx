/**
 * Avatar Component — 8Hats Lab Design System
 *
 * User avatar with image, initials fallback, and status indicator.
 * Sizes: sm (32px), md (40px), lg (56px), xl (80px)
 */

import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away';
}

const sizeClasses: Record<string, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
  xl: 'h-20 w-20 text-2xl',
};

const statusSizeClasses: Record<string, string> = {
  sm: 'h-2 w-2',
  md: 'h-2.5 w-2.5',
  lg: 'h-3 w-3',
  xl: 'h-4 w-4',
};

const statusColorClasses: Record<string, string> = {
  online: 'bg-success',
  offline: 'bg-muted-foreground',
  away: 'bg-warning',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = 'md', status, className = '', ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    const showImage = src && !imgError;
    const initials = name ? getInitials(name) : '?';

    return (
      <div ref={ref} className={`relative inline-flex shrink-0 ${className}`} {...props}>
        <div
          className={[
            'rounded-full overflow-hidden flex items-center justify-center font-medium',
            'bg-primary-light text-primary',
            sizeClasses[size],
          ].join(' ')}
        >
          {showImage ? (
            <img
              src={src}
              alt={alt || name || 'Avatar'}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        {status && (
          <span
            className={[
              'absolute bottom-0 right-0 rounded-full ring-2 ring-surface',
              statusColorClasses[status],
              statusSizeClasses[size],
            ].join(' ')}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
