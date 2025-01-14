import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
  key?: string | number;
}

export function PageTransition({ children, key }: PageTransitionProps) {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
