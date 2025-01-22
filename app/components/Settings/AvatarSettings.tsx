import {
  Form,
  useSubmit,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { UserAvatar } from '~/components/UserAvatar';
import type { User } from '~/types/user';
import { cn } from '~/lib/utils';
import { ANIMATED_AVATARS, STATIC_AVATARS } from '~/constants/avatars';
import { useState } from 'react';
import { Modal } from '~/components/ui/Modal';

interface AvatarSettingsProps {
  user: User;
}

export function AvatarSettings({ user }: AvatarSettingsProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isUploading = navigation.state === 'submitting';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletePersonalModal, setShowDeletePersonalModal] = useState<{
    show: boolean;
    avatarName?: string;
  }>({ show: false });
  const { personalAvatars = [] } = useLoaderData<{
    personalAvatars: Array<{ url: string; name: string }>;
  }>();

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 multi:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] dark:text-dark-text/90">
        Profile Picture
      </h2>

      {/* Current Avatar Section */}

      <div className="rounded-lg border border-gray-300 bg-light-secondary p-6 retro:border-retro-text/30 retro:bg-retro-secondary multi:bg-multi-primary/60 dark:border-gray-600 dark:bg-dark-secondary">
        <div className="flex w-full flex-col gap-4 sm:flex-1">
          <p className="text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 dark:text-dark-text/80">
            Your profile picture will be visible to other users. You can upload
            a custom image or choose from our preset avatars.
          </p>
        </div>
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
            {user.avatar_url && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="mt-2 rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-500 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:border-red-900 dark:hover:bg-red-950/50"
              >
                Remove Picture
              </button>
            )}
          </div>
        </div>

        {/* Personal Avatars Grid */}
        {personalAvatars.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-medium">Your Uploaded Pictures</h3>
            <p className="pb-2 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 dark:text-dark-text/80">
              Upload new pictures to your collection or choose from presets.
              Supported formats: JPG, PNG, GIF (max 5MB)
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              <Form
                method="post"
                encType="multipart/form-data"
                className="max-w-[120px]"
              >
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="avatar-upload"
                  onChange={(e) => {
                    if (
                      e.target.form &&
                      e.target.files &&
                      e.target.files.length > 0
                    ) {
                      // Check file sizes before submitting
                      const hasLargeFile = Array.from(e.target.files).some(
                        (file) => file.size > 5 * 1024 * 1024,
                      );

                      if (hasLargeFile) {
                        alert(
                          'One or more files are too large. Maximum size is 5MB.',
                        );
                        return;
                      }

                      submit(e.target.form);
                    }
                  }}
                  disabled={isUploading}
                />
                <label
                  htmlFor="avatar-upload"
                  className={cn(
                    'group relative flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 transition-all duration-200',
                    'hover:border-light-accent hover:bg-light-accent/5 active:scale-95',
                    'retro:hover:border-retro-accent retro:hover:bg-retro-accent/5',
                    'multi:hover:border-white/50 multi:hover:bg-white/5',
                    'dark:border-gray-600 dark:bg-gray-800/30 dark:hover:border-dark-accent dark:hover:bg-dark-accent/5',
                    isUploading && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <div className="flex flex-col items-center gap-2 p-2 text-center">
                    <svg
                      className="h-8 w-8 text-gray-400 group-hover:text-light-accent retro:group-hover:text-retro-accent multi:group-hover:text-white/90 dark:group-hover:text-dark-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-light-accent retro:group-hover:text-retro-accent multi:group-hover:text-white/90 dark:text-gray-400 dark:group-hover:text-dark-accent">
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </span>
                    <span className="text-[10px] text-gray-400">Max 5MB</span>
                  </div>
                </label>
              </Form>
              {personalAvatars.map((avatar) => (
                <div
                  key={avatar.name}
                  className="group relative aspect-square w-full max-w-[120px]"
                >
                  <img
                    src={avatar.url}
                    alt="Personal avatar"
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Form method="post">
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
                        className="rounded-full bg-light-accent p-2 text-white hover:bg-light-accent/90"
                        title="Use as profile picture"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    </Form>
                    <Form method="post">
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
                        type="button"
                        onClick={() =>
                          setShowDeletePersonalModal({
                            show: true,
                            avatarName: avatar.name,
                          })
                        }
                        className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                        title="Delete picture"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </Form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preset Avatars Section */}
        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <h3 className="mb-6 text-lg font-medium text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
            Preset Avatars
          </h3>

          <div className="space-y-8">
            <div>
              <h4 className="mb-4 text-sm font-medium text-light-text/70 dark:text-dark-text/70">
                Animated Avatars
              </h4>
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {ANIMATED_AVATARS.map((avatar) => (
                  <Form
                    key={avatar.id}
                    method="post"
                    action="/settings"
                    className="group w-full max-w-[100px]"
                  >
                    <input type="hidden" name="action" value="select-preset" />
                    <input type="hidden" name="avatar_url" value={avatar.url} />
                    <button
                      type="submit"
                      className="group relative flex aspect-square h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent transition-all duration-200 hover:border-light-accent retro:hover:border-retro-accent multi:hover:border-white/50 dark:hover:border-dark-accent"
                      title={avatar.preview}
                    >
                      <UserAvatar
                        username={user.username}
                        avatar_url={avatar.url}
                        size="lg"
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
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {STATIC_AVATARS.map((avatar) => (
                  <Form
                    key={avatar.id}
                    method="post"
                    action="/settings"
                    className="group w-full max-w-[100px]"
                  >
                    <input type="hidden" name="action" value="select-preset" />
                    <input type="hidden" name="avatar_url" value={avatar.url} />
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

      {/* Add confirmation modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Profile Picture"
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 dark:text-dark-text/80">
            Are you sure you want to remove your current profile picture? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              Cancel
            </button>
            <Form method="post">
              <input type="hidden" name="action" value="remove-avatar" />
              <button
                type="submit"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                Remove Picture
              </button>
            </Form>
          </div>
        </div>
      </Modal>

      {/* Add the new modal for personal avatar deletion */}
      <Modal
        isOpen={showDeletePersonalModal.show}
        onClose={() => setShowDeletePersonalModal({ show: false })}
        title="Delete Uploaded Picture"
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-sm text-light-text/80 retro:text-retro-text/80 multi:text-white/80 dark:text-dark-text/80">
            Are you sure you want to delete this picture from your collection?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeletePersonalModal({ show: false })}
              className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              Cancel
            </button>
            <Form method="post">
              <input
                type="hidden"
                name="action"
                value="delete-personal-avatar"
              />
              <input
                type="hidden"
                name="avatar_name"
                value={showDeletePersonalModal.avatarName}
              />
              <button
                type="submit"
                onClick={() => setShowDeletePersonalModal({ show: false })}
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                Delete Picture
              </button>
            </Form>
          </div>
        </div>
      </Modal>
    </section>
  );
}
