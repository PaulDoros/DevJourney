import { useEffect, useRef } from 'react';
import { useToast } from '~/context/ToastContext';
import type { UserAchievement } from '~/types/achievements';

export function useAchievementListener(userAchievements: UserAchievement[]) {
  const { showAchievement } = useToast();
  const previousAchievementsRef = useRef<UserAchievement[]>([]);

  useEffect(() => {
    // Skip first render
    if (previousAchievementsRef.current.length === 0) {
      previousAchievementsRef.current = userAchievements;
      return;
    }

    // Find new achievements by comparing with previous state
    const newAchievements = userAchievements.filter(
      (achievement) =>
        !previousAchievementsRef.current.some(
          (prev) => prev.id === achievement.id,
        ),
    );

    // Show toast for each new achievement
    newAchievements.forEach((achievement) => {
      if (achievement.achievement) {
        showAchievement(
          achievement.achievement.name,
          achievement.achievement.description,
        );
      }
    });

    // Update ref with current achievements
    previousAchievementsRef.current = userAchievements;
  }, [userAchievements, showAchievement]);
}
