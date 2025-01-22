export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  iconUrl: string | null;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
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
