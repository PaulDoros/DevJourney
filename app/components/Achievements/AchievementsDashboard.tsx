import { cn } from '~/lib/utils';
import type { Achievement, UserAchievement } from '~/types/achievements';

interface AchievementsDashboardProps {
  userAchievements: UserAchievement[];
  allAchievements: Achievement[];
}

const ACHIEVEMENT_CATEGORIES = {
  basic: {
    name: 'Getting Started',
    achievements: ['Welcome!', 'Theme Explorer', 'Avatar Customizer'],
  },
  remix: {
    name: 'Remix Features',
    achievements: [
      'Remix Explorer',
      'Data Master',
      'Form Wizard',
      'Route Master',
    ],
  },
  themes: {
    name: 'Theme Mastery',
    achievements: ['Theme Master', 'Dark Side', 'Retro Lover', 'Multi Master'],
  },
  avatars: {
    name: 'Avatar Collection',
    achievements: ['Avatar Collector', 'Custom Creator', 'Style Guru'],
  },
  engagement: {
    name: 'Community Engagement',
    achievements: [
      'Profile Perfectionist',
      'Early Bird',
      'Active Explorer',
      'Social Butterfly',
    ],
  },
  advanced: {
    name: 'Advanced Skills',
    achievements: [
      'Type Safety Guardian',
      'Layout Artist',
      'Error Boundary Pro',
      'Loader Legend',
      'Action Hero',
      'Component Master',
      'Task Manager',
      'Theme Artist',
      'Code Warrior',
      'Documentation Reader',
      'Optimization Guru',
      'Error Handler',
      'Accessibility Champion',
      'TypeScript Pro',
    ],
  },
};

export function AchievementsDashboard({
  userAchievements,
  allAchievements,
}: AchievementsDashboardProps) {
  const totalPoints = userAchievements.reduce(
    (total, ua) => total + (ua.achievement?.points || 0),
    0,
  );

  const isAchievementUnlocked = (achievementName: string) =>
    userAchievements.some((ua) => ua.achievement?.name === achievementName);

  const getAchievementDetails = (achievementName: string) =>
    allAchievements.find((a) => a.name === achievementName);

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
          Achievements
        </h2>
        <div className="text-right">
          <span className="text-2xl font-bold text-light-accent retro:text-retro-accent multi:text-multi-accent dark:text-dark-accent">
            {totalPoints}
          </span>
          <span className="ml-2 text-sm text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
            points
          </span>
        </div>
      </div>

      {/* Achievement Categories */}
      <div className="grid gap-6">
        {Object.entries(ACHIEVEMENT_CATEGORIES).map(
          ([category, { name, achievements }]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-medium text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
                {name}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {achievements.map((achievementName) => {
                  const achievement = getAchievementDetails(achievementName);
                  const isUnlocked = isAchievementUnlocked(achievementName);

                  if (!achievement) return null;

                  return (
                    <div
                      key={achievementName}
                      className={cn(
                        'relative rounded-lg border p-4',
                        isUnlocked
                          ? 'border-light-accent/20 bg-light-accent/5 retro:border-retro-accent/20 retro:bg-retro-accent/5 multi:border-white/20 multi:bg-white/5 dark:border-dark-accent/20 dark:bg-dark-accent/5'
                          : 'border-gray-200/20 bg-gray-100/5 retro:border-retro-text/20 retro:bg-retro-text/5 multi:border-white/10 multi:bg-white/5 dark:border-gray-700/20 dark:bg-gray-800/5',
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4
                            className={cn(
                              'font-medium',
                              isUnlocked
                                ? 'text-light-text retro:text-retro-text multi:text-white dark:text-dark-text'
                                : 'text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70',
                            )}
                          >
                            {achievementName}
                          </h4>
                          <p className="mt-1 text-sm text-light-text/60 retro:text-retro-text/60 multi:text-white/60 dark:text-dark-text/60">
                            {achievement.description}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'rounded-full px-2 py-1 text-xs font-medium',
                            isUnlocked
                              ? 'bg-light-accent/10 text-light-accent retro:bg-retro-accent/10 retro:text-retro-accent multi:bg-white/10 multi:text-white dark:bg-dark-accent/10 dark:text-dark-accent'
                              : 'bg-gray-100 text-gray-600 retro:bg-retro-text/10 retro:text-retro-text/60 multi:bg-white/10 multi:text-white/60 dark:bg-gray-800 dark:text-gray-400',
                          )}
                        >
                          {achievement.points} pts
                        </div>
                      </div>
                      {isUnlocked && (
                        <div className="absolute -right-1 -top-1 rounded-full bg-light-accent p-1 text-white retro:bg-retro-accent multi:bg-multi-accent dark:bg-dark-accent">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
