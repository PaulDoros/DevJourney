interface TextProps {
  variant?: "heading" | "body" | "gradient";
  children: React.ReactNode;
  className?: string;
}

export function Text({
  variant = "body",
  children,
  className = "",
}: TextProps) {
  const baseStyles = `
    ${variant === "heading" ? "text-2xl font-bold mb-4" : "text-base"}
    ${variant === "gradient" ? "multi:multi-text-gradient" : ""}
    text-light-text dark:text-dark-text retro:text-retro-text multi:text-multi-text
    ${className}
  `;

  return <div className={baseStyles}>{children}</div>;
}
