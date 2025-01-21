declare module '@lottiefiles/react-lottie-player' {
  import { ComponentType } from 'react';

  interface PlayerProps {
    src: string | object;
    autoplay?: boolean;
    loop?: boolean;
    style?: React.CSSProperties;
    className?: string;
    speed?: number;
    background?: string;
    hover?: boolean;
    direction?: number;
  }

  export const Player: ComponentType<PlayerProps>;
}
