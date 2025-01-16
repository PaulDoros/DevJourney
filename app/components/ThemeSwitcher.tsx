// Import the useTheme hook from our theme provider utility
import { useTheme } from "~/utils/theme-provider";

// ThemeSwitcher component allows users to switch between different theme modes
export function ThemeSwitcher() {
  // Get current theme and setTheme function from our theme context
  const { theme, setTheme } = useTheme();

  return (
    // Container with flex layout and gap between buttons
    <div className="flex gap-4">
      {/* Light theme button */}
      <button
        onClick={() => setTheme("light")}
        className={`px-4 py-2 rounded-md ${
          // Apply accent color when light theme is active, otherwise gray
          theme === "light"
            ? "bg-light-accent text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Light
      </button>

      {/* Dark theme button */}
      <button
        onClick={() => setTheme("dark")}
        className={`px-4 py-2 rounded-md ${
          // Apply accent color when dark theme is active, otherwise gray
          theme === "dark"
            ? "bg-dark-accent text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Dark
      </button>

      {/* Retro theme button */}
      <button
        onClick={() => setTheme("retro")}
        className={`px-4 py-2 rounded-md ${
          // Apply accent color when retro theme is active, otherwise gray
          theme === "retro"
            ? "bg-retro-accent text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Retro
      </button>

      {/* Multi-color theme button */}
      <button
        onClick={() => setTheme("multi")}
        className={`px-4 py-2 rounded-md ${
          // Apply accent color when multi theme is active, otherwise gray
          theme === "multi"
            ? "bg-multi-accent text-white"
            : "bg-gray-200 text-gray-700"
        }`}
      >
        Multi
      </button>
    </div>
  );
}
