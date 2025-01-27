import { createContext, useContext, useState } from 'react';
import type { UserAchievement } from '~/types/achievements';
import { useToast } from './ToastContext';

type AchievementContextType = {
  userAchievements: UserAchievement[];
  setUserAchievements: (achievements: UserAchievement[]) => void;
  showNewAchievementToast: (achievement: UserAchievement) => void;
};

const AchievementContext = createContext<AchievementContextType | null>(null);

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    [],
  );
  const { showAchievement } = useToast();

  const showNewAchievementToast = (achievement: UserAchievement) => {
    showAchievement({
      title: achievement.achievement.name,
      description: achievement.achievement.description,
      points: achievement.achievement.points,
    });
  };

  return (
    <AchievementContext.Provider
      value={{ userAchievements, setUserAchievements, showNewAchievementToast }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      'useAchievements must be used within an AchievementProvider',
    );
  }
  return context;
}
