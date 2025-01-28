import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to convert category slugs to display names
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    'getting-started': 'Getting Started',
    'remix-features': 'Remix Features',
    'theme-mastery': 'Theme Mastery',
    'avatar-collection': 'Avatar Collection',
    'community-engagement': 'Community Engagement',
    'advanced-skills': 'Advanced Skills',
    uncategorized: 'Other Achievements',
  };

  return (
    displayNames[category] ||
    category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}
