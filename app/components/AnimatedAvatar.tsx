import { useEffect, useState } from 'react';
import { useHydrated } from '~/hooks/useHydrated';

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
  const [LottiePlayer, setLottiePlayer] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the Lottie player only on the client side
    import('@dotlottie/react-player').then((module) => {
      setLottiePlayer(module.DotLottiePlayer);
    });
  }, []);

  // Show loading state during SSR or while loading the Lottie player
  if (!isHydrated || !LottiePlayer) {
    return (
      <div
        className={` ${className} ${size} $ animate-pulse rounded-full bg-gray-200 dark:bg-gray-700`}
      />
    );
  }

  return (
    <div
      className={` ${className} ${size} max-h-60 max-w-52 overflow-hidden rounded-full`}
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
