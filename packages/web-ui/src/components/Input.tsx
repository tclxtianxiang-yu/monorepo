import * as React from 'react';
import { cn } from '../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-web-ui border border-web-ui-border bg-web-ui-surface px-3 py-1 text-sm font-sans shadow-none transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-web-ui-ink-muted focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-web-ui-accent/15 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
