import { ThemeSwitcher } from "~/components/ThemeSwitcher";

interface ErrorContentProps {
  title: string;
  message: string | undefined;
}

export function ErrorContent({ title, message }: ErrorContentProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center 
      bg-light-secondary dark:bg-dark-secondary retro:bg-retro-secondary 
      multi:bg-gradient-to-br multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3"
    >
      <div
        className="rounded-lg p-8 shadow-lg
        bg-light-primary dark:bg-dark-primary retro:bg-retro-primary 
        multi:multi-card"
      >
        <h1
          className="mb-4 text-4xl font-bold 
          text-light-accent dark:text-dark-accent retro:text-retro-accent 
          multi:multi-text-gradient"
        >
          {title}
        </h1>
        <p
          className="text-light-text dark:text-dark-text retro:text-retro-text 
          multi:text-multi-text"
        >
          {message || "An unexpected error occurred"}
        </p>
      </div>
      <div className="mt-8">
        <ThemeSwitcher />
      </div>
    </div>
  );
}
