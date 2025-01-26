import { createContext, useContext, useCallback, useState } from 'react';
import type { Achievement } from '~/types/achievements';

interface AchievementsContextType {
  achievements: Achievement[];
  hasAchievement: (name: string) => boolean;
  addAchievement: (achievement: Achievement) => void;
}

const AchievementsContext = createContext<AchievementsContextType | null>(null);

export function AchievementsProvider({
  children,
  initialAchievements,
}: {
  children: React.ReactNode;
  initialAchievements: Achievement[];
}) {
  const [achievements, setAchievements] =
    useState<Achievement[]>(initialAchievements);

  const hasAchievement = useCallback(
    (name: string) => achievements.some((a) => a.name === name),
    [achievements],
  );

  const addAchievement = useCallback((achievement: Achievement) => {
    setAchievements((prev) => [...prev, achievement]);
  }, []);

  return (
    <AchievementsContext.Provider
      value={{ achievements, hasAchievement, addAchievement }}
    >
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within AchievementsProvider');
  }
  return context;
}
