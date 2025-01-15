export type Achievement = {
  id: string;
  name: string;
  description: string;
  unlockedAt: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  is_guest: boolean;
  points: number;
  achievements: Achievement[];
  created_at: string;
};
