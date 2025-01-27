import { AvatarPreset } from '~/constants/avatars';

export interface User {
  id: string;
  username: string;
  is_guest: boolean;
  avatar_url: string | null;
}

export interface UploadSlot {
  slot: number;
  requiredPoints: number;
}

export const UPLOAD_SLOTS: UploadSlot[] = [
  { slot: 1, requiredPoints: 200 },
  { slot: 2, requiredPoints: 500 },
  { slot: 3, requiredPoints: 1000 },
  { slot: 4, requiredPoints: 2000 },
  { slot: 5, requiredPoints: 5000 },
];

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon_url: string | null;
  preset_avatar_id: string | null;
  created_at: string;
  component_id: string | null;
}

export interface ThemeAchievement {
  achievement: {
    id: string;
    name: string;
  };
}

export interface ThemeHistory {
  theme: string;
  created_at: string;
}

export interface PersonalAvatar {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

export interface AvatarPresetRequirements {
  points?: number;
  achievementName?: string;
  locked: boolean;
  reason?: string;
}

export interface UserPreferences {
  theme: string;
}

export interface SettingsLoaderData {
  user: User;
  preferences: UserPreferences | null;
  achievements: Achievement[];
  personalAvatars: PersonalAvatar[];
}

export interface UserAchievementSimple {
  id: string;
  name: string;
  description: string;
  points: number;
}

export interface AvatarWithRequirements extends AvatarPreset {
  requirements?: {
    points?: number;
    achievement?: string;
    locked: boolean;
    reason?: string;
  };
}

export interface AvatarSettingsProps {
  user: User;
  achievements: Achievement[];
}
