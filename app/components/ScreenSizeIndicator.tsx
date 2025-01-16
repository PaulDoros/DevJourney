// Import necessary hooks from React
import { useEffect, useState } from "react";

/**
 * ScreenSizeIndicator Component
 * This component displays the current screen size and breakpoint information
 * It's only visible in development mode to help with responsive design
 */
export function ScreenSizeIndicator() {
  // Only render in development environment for debugging purposes
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  // Initialize window width state
  // useState hook creates a state variable and setter function
  // We check if window exists first since this can run on server-side
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  // useEffect hook handles side effects in functional components
  // It runs after render and handles cleanup when component unmounts
  useEffect(() => {
    // Handler function to update width state when window resizes
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener when component mounts
    window.addEventListener("resize", handleResize);

    // Cleanup function removes event listener when component unmounts
    // This prevents memory leaks
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array means this only runs on mount/unmount

  // Define standard Tailwind breakpoints
  // Each breakpoint has a name and pixel range
  const breakpoints = [
    { name: "xs", min: 0, max: 639 }, // Extra small screens
    { name: "sm", min: 640, max: 767 }, // Small screens
    { name: "md", min: 768, max: 1023 }, // Medium screens
    { name: "lg", min: 1024, max: 1279 }, // Large screens
    { name: "xl", min: 1280, max: 1535 }, // Extra large screens
    { name: "2xl", min: 1536, max: Infinity }, // 2X large screens
  ];

  // Helper function to determine current breakpoint based on window width
  const getCurrentBreakpoint = () => {
    return breakpoints.find(
      (bp) => windowWidth >= bp.min && windowWidth <= bp.max,
    );
  };

  // Get current breakpoint
  const currentBreakpoint = getCurrentBreakpoint();

  // Render the indicator
  return (
    // Fixed positioning in bottom-left corner with high z-index to stay on top
    <div className="fixed bottom-2 left-2 z-50 flex gap-2">
      {/* Container with semi-transparent black background and blur effect */}
      <div className="rounded-lg bg-black/70 px-4 py-2 font-mono text-sm text-white backdrop-blur flex items-center gap-3">
        {/* Breakpoint indicator with animated dot */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-semibold">
            {currentBreakpoint?.name.toUpperCase()}
          </span>
        </div>
        {/* Current width in pixels */}
        <div className="text-gray-400">{windowWidth}px</div>
        {/* Breakpoint range display */}
        <div className="text-xs text-gray-400">
          {currentBreakpoint &&
            (currentBreakpoint.max === Infinity
              ? `≥${currentBreakpoint.min}px` // Special case for 2xl breakpoint
              : `${currentBreakpoint.min}px - ${currentBreakpoint.max}px`)}
        </div>
      </div>
    </div>
  );
}
