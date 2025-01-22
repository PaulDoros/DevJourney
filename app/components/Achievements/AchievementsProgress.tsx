import { cn } from '~/lib/utils';
import type { UserAchievement } from '~/types/achievements';

interface AchievementsProgressProps {
  achievements: UserAchievement[];
}

const ACHIEVEMENT_CATEGORIES = {
  basic: {
    name: 'Getting Started',
    achievements: ['Welcome!', 'Theme Explorer', 'Avatar Customizer'],
  },
  themes: {
    name: 'Theme Master',
    achievements: ['Theme Master', 'Dark Side', 'Retro Lover', 'Multi Master'],
  },
  avatars: {
    name: 'Avatar Collection',
    achievements: ['Avatar Collector', 'Custom Creator', 'Style Guru'],
  },
  engagement: {
    name: 'Community',
    achievements: [
      'Profile Perfectionist',
      'Early Bird',
      'Active Explorer',
      'Social Butterfly',
    ],
  },
};

export function AchievementsProgress({
  achievements,
}: AchievementsProgressProps) {
  return (
    <div className="space-y-4">
      {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, category]) => {
        const unlockedCount = category.achievements.filter((name) =>
          achievements.some((ua) => ua.achievement?.name === name),
        ).length;
        const progress = (unlockedCount / category.achievements.length) * 100;

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
                {category.name}
              </span>
              <span className="text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
                {unlockedCount}/{category.achievements.length}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-light-primary/20 retro:bg-retro-primary/20 multi:bg-white/10 dark:bg-dark-primary/20">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progress === 100
                    ? 'bg-green-500 retro:bg-retro-accent multi:bg-multi-accent dark:bg-green-400'
                    : 'bg-light-accent retro:bg-retro-accent multi:bg-multi-accent dark:bg-dark-accent',
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
