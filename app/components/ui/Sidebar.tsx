import { cn } from '~/lib/utils';
import { Link, LinkProps, Form } from '@remix-run/react';
import React, { useState, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { UserAvatar } from '~/components/UserAvatar';
import { useHydrated } from '~/hooks/useHydrated';

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
  isForm?: boolean;
  isProfile?: boolean;
  user?: {
    username: string;
    avatar_url?: string | null;
  };
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined,
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return (
      <div
        className={cn(
          'hidden h-full w-[200px] flex-shrink-0 border-t-0 px-4 py-4 md:flex md:flex-col',
          'bg-light-secondary',
          'retro:bg-retro-secondary',
          'multi:bg-multi-primary/60 multi:backdrop-blur-sm',
          'dark:bg-dark-secondary',
          className,
        )}
      >
        {children as React.ReactNode}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        'hidden h-full w-[200px] flex-shrink-0 border-t-0 px-4 py-4 md:flex md:flex-col',
        'bg-light-secondary',
        'retro:bg-retro-secondary',
        'multi:bg-multi-primary/60 multi:backdrop-blur-sm',
        'dark:bg-dark-secondary',
        className,
      )}
      animate={{
        width: animate ? (open ? '200px' : '70px') : '200px',
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar();
  const isHydrated = useHydrated();

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          'flex h-16 w-full flex-row items-center justify-between px-4 md:hidden',
          'bg-light-secondary',
          'retro:bg-retro-secondary',
          '',
          'dark:bg-dark-secondary',
          open ? '' : 'multi:bg-multi-primary/60 multi:backdrop-blur-sm',
        )}
        {...props}
      >
        <div className="z-20 flex w-full justify-end">
          <Menu
            className="cursor-pointer text-light-text hover:text-light-accent retro:text-retro-text retro:hover:text-retro-accent multi:text-white multi:hover:text-white/80 dark:text-dark-text dark:hover:text-dark-accent"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className={cn(
                'fixed inset-0 z-[100] flex h-full w-full flex-col justify-between p-6',
                'bg-light-primary',
                'retro:bg-retro-primary',
                'multi:multi-card',
                'dark:bg-dark-primary',
                className,
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 cursor-pointer text-light-text hover:text-light-accent retro:text-retro-text retro:hover:text-retro-accent multi:text-white multi:hover:text-white/80 dark:text-dark-text dark:hover:text-dark-accent"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: Partial<LinkProps>;
}) => {
  const { open, animate } = useSidebar();

  const AnimatedText = () => (
    <motion.span
      initial={false}
      animate={{
        width: animate ? (open ? 'auto' : 0) : 'auto',
        opacity: animate ? (open ? 1 : 0) : 1,
      }}
      transition={{
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="ml-2 inline-block overflow-hidden whitespace-nowrap text-sm text-light-text transition duration-150 group-hover/sidebar:translate-x-1 retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text"
      style={{
        display: 'inline-block',
        visibility: animate && !open ? 'hidden' : 'visible',
      }}
    >
      {link.label}
    </motion.span>
  );

  const linkClasses = cn(
    'group/sidebar flex w-full items-center gap-0 py-2',
    'text-light-text hover:text-light-accent',
    'retro:text-retro-text retro:hover:text-retro-accent',
    'multi:text-white multi:hover:text-white/80',
    'dark:text-dark-text dark:hover:text-dark-accent',
    className,
  );

  const content = (
    <motion.div
      className="flex w-full items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.23, 1, 0.32, 1],
        delay: link.isProfile ? 0 : 0.1,
      }}
    >
      <div className="flex-shrink-0">
        {link.isProfile && link.user ? (
          <UserAvatar
            username={link.user.username}
            avatar_url={link.user.avatar_url}
            size="sm"
          />
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {link.icon}
          </motion.div>
        )}
      </div>
      <AnimatedText />
    </motion.div>
  );

  if (link.isForm) {
    return (
      <Form action={link.href} method="post" className={linkClasses}>
        <button type="submit" className="flex w-full items-center">
          {content}
        </button>
      </Form>
    );
  }

  return (
    <Link to={link.href} className={linkClasses} {...props}>
      {content}
    </Link>
  );
};
