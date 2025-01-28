import { useFetcher } from '@remix-run/react';
import { useToast } from '~/context/ToastContext';
import { useEffect } from 'react';

// Define types for the achievement response
interface Achievement {
  name: string;
  description: string;
  points: number;
}

interface AchievementResponse {
  success: boolean;
  achievement?: Achievement;
  removed?: boolean;
  error?: string;
}

export function AchievementTester() {
  const fetcher = useFetcher<AchievementResponse>();
  const { showAchievement, showSuccess, showError } = useToast();

  const handleTestToast = () => {
    // First show a regular toast
    showAchievement('Testing the notification system...', 'asdh gfgf  fghf');

    // Try to unlock the achievement
    fetcher.submit(
      { achievementId: 'f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454' },
      { method: 'POST', action: '/api/track-achievement' },
    );
  };

  const handleRemoveAchievement = () => {
    showSuccess('Removing achievement...');

    fetcher.submit(
      { achievementId: 'f8c3de3d-1fea-4d7c-a8b0-29f63c4c3454' },
      { method: 'DELETE', action: '/api/track-achievement' },
    );
  };

  // Handle the response from the achievement tracking
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        if (fetcher.data.removed) {
          showAchievement('Achievement removed successfully!', 'asd');
        } else if (fetcher.data.achievement) {
          showAchievement(
            fetcher.data.achievement.name,
            `${fetcher.data.achievement.description} (+${fetcher.data.achievement.points} points)`,
          );
        }
      } else if (fetcher.data.error) {
        showError(fetcher.data.error);
      }
    }
  }, [fetcher.data, showAchievement, showSuccess, showError]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold text-light-text retro:text-retro-text multi:text-white dark:text-dark-text">
        Achievement Testing Panel
      </h2>
      <div className="flex gap-4">
        <button
          onClick={handleTestToast}
          className="rounded bg-light-accent px-4 py-2 text-white hover:bg-light-accent/80 retro:bg-retro-accent retro:hover:bg-retro-accent/80 multi:bg-multi-accent multi:hover:bg-multi-accent/80 dark:bg-dark-accent dark:hover:bg-dark-accent/80"
        >
          Test Achievement System
        </button>
        <button
          onClick={handleRemoveAchievement}
          className="retro:bg-retro-error retro:hover:bg-retro-error/80 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 multi:bg-red-500 multi:hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
          Remove Achievement
        </button>
      </div>
    </div>
  );
}
