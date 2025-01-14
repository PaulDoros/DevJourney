export interface User {
  id: string;
  email?: string;
  username: string;
  isGuest: boolean;
  points: number;
  achievements: Achievement[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  unlockedAt?: string;
}
