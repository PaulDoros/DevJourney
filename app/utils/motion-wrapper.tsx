import { lazy, Suspense } from 'react';
import { DefaultErrorFallback } from '~/components/DefaultErrorFallback';

const MotionWrapper = lazy(() =>
  import('framer-motion').then((mod) => ({
    default: ({ children }: { children: React.ReactNode }) => (
      <mod.motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children}
      </mod.motion.div>
    ),
  })),
);

export function SafeMotion({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DefaultErrorFallback />}>
      <MotionWrapper>{children}</MotionWrapper>
    </Suspense>
  );
}
