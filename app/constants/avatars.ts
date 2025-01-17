export const ANIMATED_AVATARS = [
  {
    id: 'boy-2',
    url: '/avatars/animated/boy.lottie',
    preview: 'Boy animation',
    type: 'lottie',
  },
  {
    id: 'robot-1',
    url: '/avatars/animated/robot.lottie',
    preview: 'Robot animation',
    type: 'lottie',
  },
  {
    id: 'girl-1',
    url: '/avatars/animated/girl.lottie',
    preview: 'Girl animation',
    type: 'lottie',
  },
  {
    id: 'science-1',
    url: '/avatars/animated/science.lottie',
    preview: 'Science animation',
    type: 'lottie',
  },
  {
    id: 'rat-1',
    url: '/avatars/animated/rat.lottie',
    preview: 'Rat animation',
    type: 'lottie',
  },
  {
    id: 'pinguin-1',
    url: '/avatars/animated/pinguin.lottie',
    preview: 'Pinguin animation',
    type: 'lottie',
  },
  {
    id: 'dog-1',
    url: '/avatars/animated/dog.lottie',
    preview: 'Dog animation',
    type: 'lottie',
  },
] as const;

export const STATIC_AVATARS = [
  {
    id: 'boy-1',
    url: '/avatars/static/boy-static.jpg',
    preview: 'Boy avatar',
    type: 'static',
  },
  {
    id: 'man',
    url: '/avatars/static/man.jpg',
    preview: 'Man avatar',
    type: 'static',
  },
] as const;

export const ALL_AVATARS = [...ANIMATED_AVATARS, ...STATIC_AVATARS] as const;
