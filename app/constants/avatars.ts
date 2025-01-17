const STORAGE_URL =
  'https://ypouzqmzzwyxymasbkco.supabase.co/storage/v1/object/public/avatars/preset';

// Local paths for upload script
const LOCAL_PATHS = {
  ANIMATED: '/avatars/animated',
  STATIC: '/avatars/static',
} as const;

export const ANIMATED_AVATARS = [
  {
    id: 'boy-2',
    url: `${STORAGE_URL}/boy.lottie`,
    localPath: `${LOCAL_PATHS.ANIMATED}/boy.lottie`,
    preview: 'Boy animation',
    type: 'lottie',
  },
  {
    id: 'robot-1',
    url: `${STORAGE_URL}/robot.lottie`,
    localPath: `${LOCAL_PATHS.ANIMATED}/robot.lottie`,
    preview: 'Robot animation',
    type: 'lottie',
  },
  {
    id: 'girl-1',
    url: `${STORAGE_URL}/girl.lottie`,
    localPath: `${LOCAL_PATHS.ANIMATED}/girl.lottie`,
    preview: 'Girl animation',
    type: 'lottie',
  },
  {
    id: 'science-1',
    url: `${STORAGE_URL}/science.lottie`,
    localPath: `${LOCAL_PATHS.ANIMATED}/science.lottie`,
    preview: 'Science animation',
    type: 'lottie',
  },
  {
    id: 'rat-1',
    url: `${STORAGE_URL}/rat.lottie`,
    localPath: `${LOCAL_PATHS.ANIMATED}/rat.lottie`,
    preview: 'Rat animation',
    type: 'lottie',
  },
  {
    id: 'pinguin-1',
    url: `${STORAGE_URL}/pinguin.lottie`,
    localPath: `${LOCAL_PATHS.ANIMATED}/pinguin.lottie`,
    preview: 'Pinguin animation',
    type: 'lottie',
  },
  {
    id: 'dog-1',
    url: `${STORAGE_URL}/dog.lottie`,
    localPath: `${LOCAL_PATHS.ANIMATED}/dog.lottie`,
    preview: 'Dog animation',
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
