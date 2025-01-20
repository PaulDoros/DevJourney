import { useEffect, useState } from 'react';
import { useHydrated } from '~/hooks/useHydrated';
import type { DotLottiePlayer } from '@dotlottie/react-player';

interface AnimatedAvatarProps {
  url: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AnimatedAvatar = ({
  url,
  size = 'md',
  className,
}: AnimatedAvatarProps) => {
  const isHydrated = useHydrated();
  const [LottiePlayer, setLottiePlayer] = useState<
    typeof DotLottiePlayer | null
  >(null);

  useEffect(() => {
    // Only load the Lottie player on the client side
    if (typeof window !== 'undefined') {
      void import('@dotlottie/react-player')
        .then((module) => {
          setLottiePlayer(() => module.DotLottiePlayer);
        })
        .catch((error) => {
          console.error('Error loading Lottie player:', error);
        });
    }
  }, []);

  // Show a placeholder during SSR or while loading
  if (!isHydrated || !LottiePlayer) {
    return (
      <div
        className={`${className} ${getSizeClass(size)} animate-pulse rounded-full bg-gray-200 dark:bg-gray-700`}
      />
    );
  }

  return (
    <div
      className={`${className} ${getSizeClass(size)} overflow-hidden rounded-full`}
    >
      <LottiePlayer
        src={url}
        autoplay
        loop
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

// Helper function to get size classes
function getSizeClass(size: 'sm' | 'md' | 'lg'): string {
  switch (size) {
    case 'sm':
      return 'h-8 w-8';
    case 'lg':
      return 'h-16 w-16';
    default:
      return 'h-12 w-12';
  }
}
