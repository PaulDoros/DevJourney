interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg transition-all duration-300
        ${
          variant === "primary"
            ? `
          bg-light-accent dark:bg-dark-accent retro:bg-retro-accent 
          multi:multi-button
          text-white
          hover:opacity-90
        `
            : `
          bg-light-secondary dark:bg-dark-secondary retro:bg-retro-secondary 
          multi:multi-card
          text-light-text dark:text-dark-text retro:text-retro-text multi:text-multi-text
          hover:opacity-80
        `
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
