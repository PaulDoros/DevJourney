import { Sidebar, SidebarBody, SidebarLink } from '~/components/ui/Sidebar';
import { navigationLinks } from '~/components/Navigation/NavigationLinks';
import { Logo, LogoIcon } from '~/components/Logo';
import { UserAvatar } from '~/components/UserAvatar';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import { Outlet, useLoaderData } from '@remix-run/react';
import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  return { user };
}

export default function AuthenticatedLayout() {
  const { user } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        'mx-auto flex h-screen w-full flex-1 flex-col overflow-auto overflow-hidden',
        'border-gray-300 bg-light-secondary',
        'retro:border-retro-text/30 retro:bg-retro-secondary',
        'multi:border-white/50 multi:bg-gradient-to-br multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3',
        'dark:border-gray-600 dark:bg-dark-secondary',
        'md:flex-row',
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <SidebarLink key={link.href} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.username,
                href: '/profile',
                icon: (
                  <UserAvatar
                    avatar_url={user.avatar_url}
                    username={user.username}
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <Outlet />
    </div>
  );
}
