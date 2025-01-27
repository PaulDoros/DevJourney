import { useRouteLoaderData } from '@remix-run/react';
import type { Achievement } from '~/types/achievements';

interface AchievementsData {
  achievements: Achievement[];
}

export function useAchievements() {
  const data = useRouteLoaderData('root') as AchievementsData;
  return data?.achievements || [];
}
