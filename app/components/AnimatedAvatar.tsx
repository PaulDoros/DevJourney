import { useHydrated } from 'remix-utils/use-hydrated';
import { lazy, Suspense } from 'react';

const Player = lazy(() =>
  import('@lottiefiles/react-lottie-player').then((mod) => ({
    default: mod.Player,
  })),
);

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

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-32 w-32',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${
        className ?? ''
      } relative overflow-hidden rounded-full bg-gray-100`}
    >
      {isHydrated && (
        <Suspense fallback={null}>
          <Player
            src={url}
            autoplay
            loop
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </Suspense>
      )}
    </div>
  );
};
