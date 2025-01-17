import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { useHydrated } from '~/hooks/useHydrated';

export const Logo = () => {
  const isHydrated = useHydrated();

  return (
    <Link
      to="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
      {isHydrated ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="whitespace-pre font-medium text-black dark:text-white"
        >
          Dev Journey
        </motion.span>
      ) : (
        <span className="whitespace-pre font-medium text-black dark:text-white">
          Dev Journey
        </span>
      )}
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" />
    </Link>
  );
};
