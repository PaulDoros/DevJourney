declare module '@dotlottie/react-player' {
  import { ComponentProps } from 'react';

  export interface DotLottiePlayerProps extends ComponentProps<'div'> {
    src?: string;
    autoplay?: boolean;
    loop?: boolean;
    controls?: boolean;
    mode?: 'normal' | 'bounce';
    style?: React.CSSProperties;
    background?: string;
    speed?: number;
    direction?: number;
    hover?: boolean;
    renderer?: 'svg' | 'canvas';
  }

  export const DotLottiePlayer: React.FC<DotLottiePlayerProps>;
}
