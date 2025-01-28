import type { AchievementCategory } from '~/types/achievements';

// Types for theme-related achievements
export type ThemeType = 'dark' | 'retro' | 'multi';

// Types for component-related achievements
export type ComponentType =
  | 'use-fetcher'
  | 'loader-data'
  | 'form-validation'
  | 'nested-routing'
  | 'toast-test';

// Helper function to get category display name
export function getCategoryDisplayName(category: AchievementCategory): string {
  const displayNames: Record<AchievementCategory, string> = {
    'getting-started': 'Getting Started',
    'remix-features': 'Remix Features',
    'theme-mastery': 'Theme Mastery',
    'avatar-collection': 'Avatar Collection',
    'community-engagement': 'Community Engagement',
    'advanced-skills': 'Advanced Skills',
    testing: 'Testing',
  };

  return displayNames[category];
}
