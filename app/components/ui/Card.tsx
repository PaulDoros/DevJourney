interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        rounded-lg p-6 shadow-lg
        bg-light-primary dark:bg-dark-primary retro:bg-retro-primary
        multi:multi-card
        ${className}
      `}
    >
      {children}
    </div>
  );
}
