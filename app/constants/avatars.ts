const STORAGE_URL =
  'https://ypouzqmzzwyxymasbkco.supabase.co/storage/v1/object/public/avatars/preset';

// Local paths for upload script
const LOCAL_PATHS = {
  ANIMATED: '/avatars/animated',
  STATIC: '/avatars/static',
} as const;
export const ANIMATED_AVATARS = [
  {
    id: 'business-team',
    url: `${STORAGE_URL}/business-team.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/business-team.json`,
    preview: 'business-team',
    type: 'lottie',
  },
  {
    id: 'connection-error',
    url: `${STORAGE_URL}/connection-error.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/connection-error.json`,
    preview: 'connection-error',
    type: 'lottie',
  },
  {
    id: 'polar-bear',
    url: `${STORAGE_URL}/polar-bear.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/polar-bear.json`,
    preview: 'polar-bear',
    type: 'lottie',
  },
  {
    id: 'searching-food',
    url: `${STORAGE_URL}/searching-food.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/searching-food.json`,
    preview: 'searching-food',
    type: 'lottie',
  },
  {
    id: 'winne-the-pooh',
    url: `${STORAGE_URL}/winne-the-pooh.json`,
    localPath: `${LOCAL_PATHS.ANIMATED}/winne-the-pooh.json`,
    preview: 'winne-the-pooh',
    type: 'lottie',
  },
] as const;

export const STATIC_AVATARS = [
  {
    id: 'boy-1',
    url: `${STORAGE_URL}/boy-static.jpg`,
    localPath: `${LOCAL_PATHS.STATIC}/boy-static.jpg`,
    preview: 'Boy avatar',
    type: 'static',
  },
  {
    id: 'man',
    url: `${STORAGE_URL}/man.jpg`,
    localPath: `${LOCAL_PATHS.STATIC}/man.jpg`,
    preview: 'Man avatar',
    type: 'static',
  },
] as const;

export const ALL_AVATARS = [...ANIMATED_AVATARS, ...STATIC_AVATARS] as const;
