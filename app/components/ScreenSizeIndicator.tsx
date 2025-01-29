// Import necessary hooks from React
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

/**
 * ScreenSizeIndicator Component
 * This component displays the current screen size and breakpoint information
 * It's only visible in development mode to help with responsive design
 */
export function ScreenSizeIndicator() {
  // Only render in development environment for debugging purposes
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  // Initialize window width state
  // useState hook creates a state variable and setter function
  // We check if window exists first since this can run on server-side
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  // useEffect hook handles side effects in functional components
  // It runs after render and handles cleanup when component unmounts
  useEffect(() => {
    // Handler function to update width state when window resizes
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener when component mounts
    window.addEventListener('resize', handleResize);

    // Cleanup function removes event listener when component unmounts
    // This prevents memory leaks
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array means this only runs on mount/unmount

  // Define standard Tailwind breakpoints
  // Each breakpoint has a name and pixel range
  const breakpoints = [
    { name: 'xs', min: 0, max: 639 }, // Extra small screens
    { name: 'sm', min: 640, max: 767 }, // Small screens
    { name: 'md', min: 768, max: 1023 }, // Medium screens
    { name: 'lg', min: 1024, max: 1279 }, // Large screens
    { name: 'xl', min: 1280, max: 1535 }, // Extra large screens
    { name: '2xl', min: 1536, max: Infinity }, // 2X large screens
  ];

  // Helper function to determine current breakpoint based on window width
  const getCurrentBreakpoint = () => {
    return breakpoints.find(
      (bp) => windowWidth >= bp.min && windowWidth <= bp.max,
    );
  };

  // Get current breakpoint
  const currentBreakpoint = getCurrentBreakpoint();

  // Add state for expanded view
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState<'left' | 'right'>('right');

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent expanding when changing position
    setPosition((prev) => (prev === 'left' ? 'right' : 'left'));
  };

  // Render the indicator
  return (
    <motion.div
      className="fixed z-50 flex gap-2"
      initial={{
        bottom: '1rem',
        right: '1rem',
      }}
      animate={{
        bottom: '1rem',
        left: position === 'left' ? '1rem' : 'auto',
        right: position === 'right' ? '1rem' : 'auto',
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg',
          position === 'right' ? 'flex-row-reverse' : 'flex-row',
        )}
        initial={{
          backgroundColor: 'transparent',
          width: '28px',
          padding: '0.5rem',
        }}
        animate={{
          backgroundColor: isExpanded ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
          width: isExpanded ? 'auto' : '28px',
          padding: isExpanded ? '0.5rem 1rem' : '0.5rem',
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
      >
        {/* Dot indicator with tooltip */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className="relative h-2.5 w-2.5 flex-shrink-0"
                onDoubleClick={handleDoubleClick}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="absolute inset-0 h-full w-full animate-ping rounded-full bg-green-400 opacity-25" />
                <span className="relative block h-full w-full rounded-full bg-green-400" />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Double-click to change position</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Content container */}
        <motion.div
          className={cn(
            'flex items-center gap-3 whitespace-nowrap',
            position === 'right' ? 'flex-row-reverse' : 'flex-row',
          )}
          animate={{
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{
            duration: 0.1,
            ease: 'easeInOut',
          }}
        >
          <motion.span className="font-semibold text-white">
            {currentBreakpoint?.name.toUpperCase()}
          </motion.span>

          <motion.div className="text-gray-400">{windowWidth}px</motion.div>

          <motion.div className="text-xs text-gray-400">
            {currentBreakpoint &&
              (currentBreakpoint.max === Infinity
                ? `≥${currentBreakpoint.min}px`
                : `${currentBreakpoint.min}px - ${currentBreakpoint.max}px`)}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
