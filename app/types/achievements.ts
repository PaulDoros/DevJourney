export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
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
