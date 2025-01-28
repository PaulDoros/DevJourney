import { cn, getCategoryDisplayName } from '~/lib/utils';
import type {
  Achievement,
  UserAchievement,
  AchievementCategory,
} from '~/types/achievements';

interface AchievementsProgressProps {
  userAchievements: UserAchievement[];
  allAchievements: Achievement[];
}

export function AchievementsProgress({
  userAchievements,
  allAchievements,
}: AchievementsProgressProps) {
  // Group achievements by category
  const achievementsByCategory = allAchievements.reduce(
    (acc, achievement) => {
      const category = achievement.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(achievement);
      return acc;
    },
    {} as Record<AchievementCategory, Achievement[]>,
  );

  return (
    <div className="space-y-4">
      {Object.entries(achievementsByCategory).map(
        ([category, achievements]) => {
          const unlockedCount = achievements.filter((achievement) =>
            userAchievements.some((ua) => ua.achievement_id === achievement.id),
          ).length;
          const progress = (unlockedCount / achievements.length) * 100;

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
                  {getCategoryDisplayName(category as AchievementCategory)}
                </span>
                <span className="text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
                  {unlockedCount}/{achievements.length}
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
        },
      )}
    </div>
  );
}
