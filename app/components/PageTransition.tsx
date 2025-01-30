import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

const pageVariants = {
  initial: {
    opacity: 0.85,
    y: 4,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0.85,
    y: -4,
    transition: {
      duration: 0.2,
    },
  },
};

const pageTransition = {
  type: 'spring',
  stiffness: 380,
  damping: 30,
};

export function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex-1 overflow-auto will-change-transform"
    >
      {children}
    </motion.div>
  );
}
