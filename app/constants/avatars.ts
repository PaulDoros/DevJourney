const STORAGE_URL =
  'https://ypouzqmzzwyxymasbkco.supabase.co/storage/v1/object/public/avatars/preset';

// Local paths for upload script
const LOCAL_PATHS = {
  ANIMATED: '/avatars/animated',
  STATIC: '/avatars/static',
} as const;

export type AvatarPreset = {
  id: string;
  url: string;
  preview: string;
  type: 'static' | 'lottie';
  localPath?: string;
  requirements?: {
    points?: number;
    achievement?: string;
  };
};

export const ANIMATED_AVATARS: AvatarPreset[] = [
  {
    id: 'animated-1',
    url: `${STORAGE_URL}/basic.json`,
    preview: 'Basic Animated',
    type: 'lottie',
  },
  {
    id: 'animated-2',
    url: `${STORAGE_URL}/heart.json`,
    preview: 'Theme Master',
    type: 'lottie',
    requirements: {
      achievement: 'Theme Master',
      points: 200,
    },
  },
  {
    id: 'business-team',
    url: `${STORAGE_URL}/business-team.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/business-team.json`,
    preview: 'business-team',
    type: 'lottie',
    requirements: {
      points: 300,
    },
  },
  {
    id: 'connection-error',
    url: `${STORAGE_URL}/connection-error.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/connection-error.json`,
    preview: 'connection-error',
    type: 'lottie',
    requirements: {
      points: 400,
    },
  },
  {
    id: 'polar-bear',
    url: `${STORAGE_URL}/polar-bear.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/polar-bear.json`,
    preview: 'polar-bear',
    type: 'lottie',
    requirements: {
      achievement: 'Early Bird',
    },
  },
  {
    id: 'searching-food',
    url: `${STORAGE_URL}/searching-food.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/searching-food.json`,
    preview: 'searching-food',
    type: 'lottie',
    requirements: {
      achievement: 'Active Explorer',
    },
  },
  {
    id: 'winne-the-pooh',
    url: `${STORAGE_URL}/winne-the-pooh.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/winne-the-pooh.json`,
    preview: 'winne-the-pooh',
    type: 'lottie',
    requirements: {
      achievement: 'Social Butterfly',
    },
  },
] as const;

export const STATIC_AVATARS: AvatarPreset[] = [
  {
    id: 'static-1',
    url: `${STORAGE_URL}/stick.png`,
    preview: 'Basic Static',
    type: 'static',
  },
  {
    id: 'static-2',
    url: `${STORAGE_URL}/bat.png`,
    preview: 'Collector',
    type: 'static',
    requirements: {
      achievement: 'Avatar Collector',
      points: 500,
    },
  },
  {
    id: 'boy-1',
    url: `${STORAGE_URL}/boy-static.jpg`,
    localPath: `${LOCAL_PATHS.STATIC}/boy-static.jpg`,
    preview: 'Boy avatar',
    type: 'static',
    requirements: {
      points: 150,
    },
  },
  {
    id: 'man',
    url: `${STORAGE_URL}/man.jpg`,
    localPath: `${LOCAL_PATHS.STATIC}/man.jpg`,
    preview: 'Man avatar',
    type: 'static',
    requirements: {
      points: 250,
    },
  },
] as const;

export const ALL_AVATARS = [...ANIMATED_AVATARS, ...STATIC_AVATARS] as const;
