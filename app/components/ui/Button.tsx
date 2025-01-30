import { forwardRef } from 'react';
import { cn } from '~/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  customClasses?: {
    root?: string;
    hover?: string;
    focus?: string;
    active?: string;
    disabled?: string;
  };
}

const baseStyles = {
  root: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  hover: '',
  focus: '',
  active: '',
  disabled: '',
};

const variants = {
  default: {
    root: 'bg-light-accent text-light-accent-foreground hover:bg-light-accent/90 retro:bg-retro-accent retro:text-retro-accent-foreground retro:hover:bg-retro-accent/90 multi:bg-multi-accent multi:text-multi-accent-foreground multi:hover:bg-multi-accent/90 dark:bg-dark-accent dark:text-dark-accent-foreground dark:hover:bg-dark-accent/90',
    hover: 'hover:bg-light-accent/90',
    focus: 'focus-visible:ring-light-accent',
    active: 'active:scale-95',
    disabled: 'disabled:bg-light-accent/50',
  },
  destructive: {
    root: 'bg-red-500 text-white',
    hover: 'hover:bg-red-600',
    focus: 'focus-visible:ring-red-500',
    active: 'active:scale-95',
    disabled: 'disabled:bg-red-500/50',
  },
  outline: {
    root: 'border border-input bg-background',
    hover: 'hover:bg-accent hover:text-accent-foreground',
    focus: 'focus-visible:ring-accent',
    active: 'active:scale-95',
    disabled: 'disabled:bg-accent/50',
  },
  secondary: {
    root: 'bg-secondary text-secondary-foreground',
    hover: 'hover:bg-secondary/80',
    focus: 'focus-visible:ring-secondary',
    active: 'active:scale-95',
    disabled: 'disabled:bg-secondary/50',
  },
  ghost: {
    root: 'hover:bg-accent hover:text-accent-foreground',
    hover: 'hover:bg-accent/50',
    focus: 'focus-visible:ring-accent',
    active: 'active:scale-95',
    disabled: 'disabled:bg-accent/50',
  },
  link: {
    root: 'text-primary underline-offset-4',
    hover: 'hover:underline',
    focus: 'focus-visible:ring-primary',
    active: 'active:scale-95',
    disabled: 'disabled:text-primary/50',
  },
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      customClasses,
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = variants[variant];
    const sizeStyles = sizes[size];

    const combinedClasses = cn(
      baseStyles.root,
      variantStyles.root,
      sizeStyles,
      customClasses?.root,
      className,
    );

    return (
      <button className={combinedClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
