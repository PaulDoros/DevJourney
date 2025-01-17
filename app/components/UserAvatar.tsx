import { AnimatedAvatar } from './AnimatedAvatar';
import { cn } from '~/lib/utils';

interface UserAvatarProps {
  username: string;
  avatar_url?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({
  username,
  avatar_url,
  size = 'sm',
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'h-7 w-7 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-20 w-20 text-2xl sm:h-24 sm:w-24',
  };

  // Default avatar (first letter)
  if (!avatar_url) {
    return (
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-full',
          sizeClasses[size],
          'bg-light-primary text-light-text',
          'retro:bg-retro-primary retro:text-retro-text',
          'multi:bg-white/20 multi:text-white',
          'dark:bg-dark-primary dark:text-dark-text',
        )}
      >
        {username[0].toUpperCase()}
      </div>
    );
  }

  // Animated avatar (.lottie or .json)
  if (avatar_url.endsWith('.lottie') || avatar_url.endsWith('.json')) {
    return (
      <AnimatedAvatar
        url={avatar_url}
        size={size}
        className={cn(
          'bg-light-secondary',
          'retro:bg-retro-secondary',
          'multi:bg-multi-primary/60',
          'dark:bg-dark-secondary',
        )}
      />
    );
  }

  // Static image
  return (
    <div
      className={cn(
        'relative flex-shrink-0 overflow-hidden rounded-full',
        sizeClasses[size],
        'bg-light-secondary',
        'retro:bg-retro-secondary',
        'multi:bg-multi-primary/60',
        'dark:bg-dark-secondary',
      )}
    >
      <img
        src={avatar_url}
        alt={`${username}'s avatar`}
        className="h-full w-full object-cover"
      />
    </div>
  );
};
