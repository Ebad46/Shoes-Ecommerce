'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'subtle';
  accent?: 'blue' | 'emerald' | 'amber' | 'rose' | 'purple';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    hover = false, 
    variant = 'default',
    accent,
    children, 
    ...props 
  }, ref) => {
    const variants = {
      default: 'bg-white border border-neutral-200 shadow-sm',
      elevated: 'bg-white border border-neutral-100 shadow-lg',
      outlined: 'bg-transparent border-2 border-neutral-300',
      subtle: 'bg-neutral-50 border border-transparent',
    };

    const accentBorder = {
      blue: 'hover:border-blue-300',
      emerald: 'hover:border-emerald-300',
      amber: 'hover:border-amber-300',
      rose: 'hover:border-rose-300',
      purple: 'hover:border-purple-300',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-300',
          variants[variant],
          hover && [
            'cursor-pointer',
            'hover:shadow-xl',
            accent && accentBorder[accent] || 'hover:border-neutral-300',
            'hover:scale-[1.02]',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 pt-6 pb-4', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-bold bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-neutral-600 mt-2 leading-relaxed', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100',
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };