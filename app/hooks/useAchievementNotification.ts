import { useFetcher } from '@remix-run/react';
import { useCallback, useRef } from 'react';
import { debounce } from '~/utils/debounce';
import { useAchievements } from '~/context/achievements-context';

export function useAchievementNotification() {
  const fetcher = useFetcher();
  const { hasAchievement, addAchievement } = useAchievements();
  const achievementCache = useRef(new Set<string>());

  const trackAchievement = useCallback(
    debounce(async (componentId: string, achievementName: string) => {
      // Don't track if already achieved
      if (hasAchievement(achievementName)) {
        return;
      }

      // Check local cache to prevent duplicate requests
      if (achievementCache.current.has(componentId)) {
        return;
      }

      try {
        const formData = new FormData();
        formData.append('componentId', componentId);

        // Optimistically update UI
        addAchievement({
          name: achievementName,
          unlockedAt: new Date().toISOString(),
        });

        // Add to cache before making request
        achievementCache.current.add(componentId);

        fetcher.submit(formData, {
          method: 'POST',
          action: '/api/track-achievement',
        });

        // Clear cache after window
        setTimeout(() => {
          achievementCache.current.delete(componentId);
        }, 5000);
      } catch (error) {
        console.error('Error tracking achievement:', error);
      }
    }, 1000),
    [fetcher, hasAchievement, addAchievement],
  );

  return {
    trackAchievement,
    isTracking: fetcher.state !== 'idle',
  };
}
