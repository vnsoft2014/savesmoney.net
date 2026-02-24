import { cn } from '@/lib/utils';
import * as React from 'react';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                data-slot="input"
                className={cn(
                    'border-input h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
                    'placeholder:text-muted-foreground',
                    'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
                    'selection:bg-primary selection:text-primary-foreground',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = 'Input';

export { Input };
