import { useState } from 'react';
import { Link } from '@remix-run/react';
import {
  UserPlusIcon,
  TrophyIcon,
  FolderIcon,
  XMarkIcon,
} from '@heroicons/react/16/solid';

export function GuestBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-50 mx-auto w-full bg-gradient-to-b from-light-secondary/80 to-transparent backdrop-blur-sm dark:from-dark-secondary/80">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mt-4 rounded-lg border-2 border-light-accent/20 bg-light-primary p-6 shadow-lg retro:border-retro-accent/20 retro:bg-retro-primary multi:border-multi-accent/20 multi:multi-card dark:border-dark-accent/20 dark:bg-dark-primary">
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-6 top-6 text-light-text/50 hover:text-light-text retro:text-retro-text/50 retro:hover:text-retro-text multi:text-multi-text/50 multi:hover:text-multi-text dark:text-dark-text/50 dark:hover:text-dark-text"
          >
            <XMarkIcon />
          </button>

          <div className="flex flex-col items-center gap-6">
            <div className="mb-2 flex items-center justify-center">
              <UserPlusIcon className="text-light-accent retro:text-retro-accent multi:text-multi-accent dark:text-dark-accent" />
            </div>

            <div className="text-center">
              <p className="mb-4 text-base text-light-text retro:text-retro-text multi:text-multi-text dark:text-dark-text">
                You're browsing as a guest. Create an account to start earning
                HeroCoins!
              </p>
              <ul className="mb-6 flex justify-center gap-8 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-multi-text/80 dark:text-dark-text/80">
                <li className="flex items-center gap-2">
                  <FolderIcon className="text-light-accent retro:text-retro-accent multi:text-multi-accent dark:text-dark-accent" />
                  Track your HeroCoins
                </li>
                <li className="flex items-center gap-2">
                  <TrophyIcon className="text-light-accent retro:text-retro-accent multi:text-multi-accent dark:text-dark-accent" />
                  Earn rewards
                </li>
              </ul>
            </div>

            <Link
              to="/login"
              className="group flex items-center gap-2 rounded-lg bg-light-accent px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-light-accent/90 hover:shadow-lg retro:bg-retro-accent retro:hover:bg-retro-accent/90 multi:bg-multi-accent multi:hover:bg-multi-accent/90 dark:bg-dark-accent dark:hover:bg-dark-accent/90"
              onClick={() => setIsVisible(false)}
            >
              <UserPlusIcon />
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
