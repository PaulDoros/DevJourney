import { Form, useSubmit, useLoaderData } from '@remix-run/react';
import { UserAvatar } from '~/components/UserAvatar';
import type { User } from '~/types/user';
import { ANIMATED_AVATARS, STATIC_AVATARS } from '~/constants/avatars';

interface AvatarSettingsProps {
  user: User;
}

export function AvatarSettings({ user }: AvatarSettingsProps) {
  const submit = useSubmit();
  const { personalAvatars = [] } = useLoaderData<{
    personalAvatars: Array<{ url: string; name: string }>;
  }>();

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
        Profile Picture
      </h2>
      <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <UserAvatar
                username={user.username}
                avatar_url={user.avatar_url}
                size="lg"
              />
              <div className="bg-light-background/80 dark:bg-dark-background/80 absolute -bottom-1 left-1/2 -translate-x-1/2 transform rounded-full px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                Current
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-1">
            <p className="text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 dark:text-dark-text/80">
              Upload a new profile picture or choose from our preset avatars.
              Supported formats: JPG, PNG, GIF (max 5MB)
            </p>

            <div className="flex flex-wrap gap-3">
              <Form
                method="post"
                action="/settings"
                encType="multipart/form-data"
              >
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={(e) => {
                    if (e.target.form) submit(e.target.form);
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className="flex cursor-pointer items-center justify-center rounded-md bg-light-accent px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-light-accent/90"
                >
                  Upload New Picture
                </label>
              </Form>

              {user.avatar_url && (
                <Form method="post" action="/settings">
                  <input type="hidden" name="action" value="remove-avatar" />
                  <button
                    type="submit"
                    className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105 hover:bg-red-600"
                  >
                    Remove Picture
                  </button>
                </Form>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="mb-6 text-lg font-medium text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
              Personal Avatars
            </h3>
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
              <Form
                method="post"
                action="/settings"
                encType="multipart/form-data"
                className="group aspect-square"
              >
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="hidden"
                  id="personal-avatar-upload"
                  onChange={(e) => {
                    if (e.target.form) submit(e.target.form);
                  }}
                />
                <label
                  htmlFor="personal-avatar-upload"
                  className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5">
                    <svg
                      className="mb-3 h-10 w-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Upload
                    </p>
                  </div>
                </label>
              </Form>

              {personalAvatars.map((avatar) => (
                <Form
                  key={avatar.name}
                  method="post"
                  action="/settings"
                  className="group relative aspect-square"
                >
                  <input type="hidden" name="action" value="select-preset" />
                  <input type="hidden" name="avatar_url" value={avatar.url} />
                  <button
                    type="submit"
                    className="group relative h-full w-full overflow-hidden rounded-lg border-2 border-transparent transition-all duration-200 hover:border-light-accent retro:hover:border-retro-accent multi:hover:border-white/50 dark:hover:border-dark-accent"
                    title="Use this avatar"
                  >
                    <img
                      src={avatar.url}
                      alt="Personal avatar"
                      className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                    />
                  </button>

                  <Form
                    method="post"
                    action="/settings"
                    className="absolute -right-2 -top-2 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <input
                      type="hidden"
                      name="action"
                      value="delete-personal-avatar"
                    />
                    <input
                      type="hidden"
                      name="avatar_name"
                      value={avatar.name}
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      title="Delete avatar"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </Form>
                </Form>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 dark:border-gray-700">
            <h3 className="mb-6 text-lg font-medium text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
              Preset Avatars
            </h3>

            <div className="space-y-8">
              <div>
                <h4 className="mb-4 text-sm font-medium text-light-text/70 dark:text-dark-text/70">
                  Animated Avatars
                </h4>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
                  {ANIMATED_AVATARS.map((avatar) => (
                    <Form
                      key={avatar.id}
                      method="post"
                      action="/settings"
                      className="group"
                    >
                      <input
                        type="hidden"
                        name="action"
                        value="select-preset"
                      />
                      <input
                        type="hidden"
                        name="avatar_url"
                        value={avatar.url}
                      />
                      <button
                        type="submit"
                        className="group relative aspect-square w-full overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 hover:border-light-accent retro:hover:border-retro-accent multi:hover:border-white/50 dark:hover:border-dark-accent"
                        title={avatar.preview}
                      >
                        <UserAvatar
                          username={user.username}
                          avatar_url={avatar.url}
                          size="md"
                        />
                      </button>
                    </Form>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-medium text-light-text/70 dark:text-dark-text/70">
                  Static Avatars
                </h4>
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
                  {STATIC_AVATARS.map((avatar) => (
                    <Form
                      key={avatar.id}
                      method="post"
                      action="/settings"
                      className="group"
                    >
                      <input
                        type="hidden"
                        name="action"
                        value="select-preset"
                      />
                      <input
                        type="hidden"
                        name="avatar_url"
                        value={avatar.url}
                      />
                      <button
                        type="submit"
                        className="group relative aspect-square w-full overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 hover:border-light-accent retro:hover:border-retro-accent multi:hover:border-white/50 dark:hover:border-dark-accent"
                        title={avatar.preview}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.preview}
                          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                        />
                      </button>
                    </Form>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
