export type AchievementCategory =
  | 'getting-started'
  | 'remix-features'
  | 'theme-mastery'
  | 'avatar-collection'
  | 'community-engagement'
  | 'advanced-skills'
  | 'testing';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  category: AchievementCategory;
  component_id: string | null;
  icon_url: string | null;
  preset_avatar_id: string | null;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface Avatar {
  id: string;
  name: string;
  type: 'static' | 'lottie';
  url: string;
  achievementId: string | null;
  createdAt: string;
}

// Component and theme related types
export type ComponentId =
  | 'use-fetcher'
  | 'loader-data'
  | 'form-validation'
  | 'nested-routing'
  | 'toast-test';

export type ThemeId = 'dark' | 'retro' | 'multi';
