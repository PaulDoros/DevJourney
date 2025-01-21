import { ThemeSwitcher } from '~/components/ThemeSwitcher';
import { useTheme } from '~/utils/theme-provider';
import { PageLayout } from '~/components/layouts/PageLayout';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json, ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { AvatarSettings } from '~/components/Settings/AvatarSettings';
import { supabase } from '~/utils/supabase.server';
import {
  getUserAvatars,
  deleteOldAvatar,
} from '~/utils/supabase-storage.server';
import { createServerSupabase } from '~/utils/supabase';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  const personalAvatars = await getUserAvatars(user.id);
  return json({ user, personalAvatars });
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();

  // Get authenticated client
  const { supabase } = createServerSupabase(request);

  // Handle file upload
  if (formData.has('avatar')) {
    const files = formData.getAll('avatar');
    const uploadedUrls = [];

    for (const fileData of files) {
      // Skip if not a file
      if (!(fileData instanceof Blob)) continue;

      const file = fileData as Blob;

      if (!file || file.size === 0) continue;

      if (file.size > 5 * 1024 * 1024) {
        return json({ error: 'File too large (max 5MB)' }, { status: 400 });
      }

      // Get the file name from the formData
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const filePath = `${user.id}/custom/${fileName}`;

      try {
        // Convert blob to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to user's folder in Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, buffer, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('File processing error:', error);
        continue;
      }
    }

    if (uploadedUrls.length === 0) {
      return json(
        { error: 'No files were uploaded successfully' },
        { status: 400 },
      );
    }

    // Set the first uploaded image as the profile picture if user doesn't have one
    if (!user.avatar_url) {
      await supabase
        .from('users')
        .update({ avatar_url: uploadedUrls[0] })
        .eq('id', user.id);
    }

    return json({ success: true, avatar_urls: uploadedUrls });
  }

  // Handle personal avatar deletion
  if (formData.get('action') === 'delete-personal-avatar') {
    const avatarName = formData.get('avatar_name') as string;
    const filePath = `${user.id}/custom/${avatarName}`;

    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return json({ error: 'Failed to delete avatar' }, { status: 500 });
    }

    // If this was the current avatar, remove it from user profile
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (currentUser?.avatar_url?.includes(avatarName)) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        return json({ error: 'Profile update failed' }, { status: 500 });
      }
    }

    return json({ success: true });
  }

  // Handle preset avatar selection
  if (formData.get('action') === 'select-preset') {
    const avatarUrl = formData.get('avatar_url') as string;

    // Get current avatar URL before updating
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Delete old custom avatar if exists
    if (currentUser?.avatar_url?.includes('/avatars/custom/')) {
      await deleteOldAvatar(currentUser.avatar_url);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: avatarUrl })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return Response.json({ error: 'Profile update failed' }, { status: 500 });
    }

    return Response.json({ success: true, avatar_url: avatarUrl });
  }

  // Handle avatar removal
  if (formData.get('action') === 'remove-avatar') {
    // Get current avatar URL before updating
    const { data: currentUser } = await supabase
      .from('users')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    // Delete old custom avatar if exists
    if (currentUser?.avatar_url?.includes('/avatars/custom/')) {
      await deleteOldAvatar(currentUser.avatar_url);
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: null })
      .eq('id', user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return json({ error: 'Profile update failed' }, { status: 500 });
    }

    return json({ success: true });
  }

  return json({ error: 'Invalid action' }, { status: 400 });
}

export default function Settings() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <PageLayout>
      <div className="h-full w-full px-4 py-6 scrollbar-hide">
        <h1 className="text-2xl font-bold text-light-text retro:text-retro-text multi:text-white multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text">
          Settings
        </h1>

        <div className="mx-auto space-y-6 pb-8">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
              Theme
            </h2>
            <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
              <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                Choose your preferred theme appearance. Changes are saved
                automatically.
              </p>
              <ThemeSwitcher />
            </div>
          </section>

          {!user.is_guest && (
            <>
              <AvatarSettings user={user} />

              <section>
                <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
                  Account
                </h2>
                <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
                  <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                    Manage your account settings and preferences.
                  </p>
                  {/* Account settings will go here */}
                </div>
              </section>

              <section>
                <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
                  Notifications
                </h2>
                <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
                  <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                    Configure how and when you receive notifications.
                  </p>
                  {/* Notification settings will go here */}
                </div>
              </section>
            </>
          )}

          {user.is_guest && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
                Unlock More Features
              </h2>
              <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
                <p className="mb-4 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80">
                  Create an account to unlock additional features:
                </p>

                <ul className="mb-6 space-y-2">
                  {[
                    'Customize your profile avatar',
                    'Track your progress and earn achievements',
                    'Save your preferences across devices',
                    'Join the developer community',
                    'Access exclusive content and features',
                    'Participate in coding challenges',
                  ].map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/80"
                    >
                      <svg
                        className="h-5 w-5 text-light-accent retro:text-retro-accent multi:text-white dark:text-dark-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-4">
                  <a
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md bg-light-accent px-4 py-2 text-sm font-medium text-white hover:bg-light-accent/90 retro:bg-retro-accent retro:hover:bg-retro-accent/90 multi:bg-multi-gradient multi:from-multi-gradient-1 multi:via-multi-gradient-2 multi:to-multi-gradient-3 multi:text-white multi:shadow-lg multi:transition-all multi:hover:scale-105 multi:hover:animate-gradient multi:hover:shadow-xl dark:bg-dark-accent dark:hover:bg-dark-accent/90"
                  >
                    Create Account
                  </a>
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm text-light-text hover:text-light-accent retro:text-retro-text retro:hover:text-retro-accent multi:text-white multi:hover:text-white/80 dark:text-dark-text dark:hover:text-dark-accent"
                  >
                    Already have an account? Sign in
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
