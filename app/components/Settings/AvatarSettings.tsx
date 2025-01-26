import {
  Form,
  useSubmit,
  useLoaderData,
  useNavigation,
} from '@remix-run/react';
import { UserAvatar } from '~/components/UserAvatar';
import { cn } from '~/lib/utils';
import { ANIMATED_AVATARS, STATIC_AVATARS } from '~/constants/avatars';
import type { AvatarPreset } from '~/constants/avatars';
import { useState, useEffect } from 'react';
import { Modal } from '~/components/ui/Modal';

import { AnimatedAvatar } from '~/components/AnimatedAvatar';

// Define a simplified achievement type for what we actually need
interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
}

interface UserAchievementSimple {
  id: string;
  achievement: Achievement;
}

interface AvatarWithRequirements extends AvatarPreset {
  requirements?: {
    points?: number;
    achievement?: string;
    locked: boolean;
    reason?: string;
  };
}

interface AvatarSettingsProps {
  user: {
    id: string;
    username: string;
    is_guest: boolean;
    avatar_url: string | null;
  };
  achievements: UserAchievementSimple[];
}

// Move helper functions outside the component
function checkAvatarLock(
  avatar: AvatarPreset,
  achievements: UserAchievementSimple[],
  totalPoints: number,
): boolean {
  if (!avatar.requirements) return false;

  const { points, achievement } = avatar.requirements;

  if (points && totalPoints < points) return true;
  if (
    achievement &&
    !achievements.some((ua) => ua.achievement.name === achievement)
  )
    return true;

  return false;
}

function getLockReason(
  avatar: AvatarPreset,
  achievements: UserAchievementSimple[],
  totalPoints: number,
): string | undefined {
  if (!avatar.requirements) return undefined;

  const { points, achievement } = avatar.requirements;

  if (points && totalPoints < points) {
    return `Requires ${points} points (you have ${totalPoints})`;
  }
  if (
    achievement &&
    !achievements.some((ua) => ua.achievement.name === achievement)
  ) {
    return `Unlock "${achievement}" achievement first`;
  }

  return undefined;
}

function LockOverlay({ lockReason }: { lockReason: string | undefined }) {
  // Extract points from lockReason if it exists
  const pointsRequired = lockReason?.match(/Requires (\d+) points/)?.[1];

  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
      <div className="text-center text-xs text-white">
        <span className="text-lg">🔒</span>
        {/* Show points only on mobile, full reason on desktop */}
        <p className="mt-1 px-1 text-[10px]">
          <span className="hidden sm:inline">{lockReason}</span>
          <span className="sm:hidden">
            {pointsRequired && `${pointsRequired}p`}
          </span>
        </p>
      </div>
    </div>
  );
}

export function AvatarSettings({ user, achievements }: AvatarSettingsProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isUploading = navigation.state === 'submitting';

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletePersonalModal, setShowDeletePersonalModal] = useState<{
    show: boolean;
    avatarName: string;
    isCurrentAvatar: boolean;
  }>({ show: false, isCurrentAvatar: false, avatarName: '' });
  const { personalAvatars = [] } = useLoaderData<{
    personalAvatars: Array<{
      name: string;
      url: string;
      size: number;
      created_at: string;
    }>;
  }>();

  // Calculate total points from achievements
  const totalPoints = achievements.reduce(
    (total, ua) => total + (ua.achievement?.points || 0),
    0,
  );

  // Calculate available avatars with requirements

  const isDeleting =
    navigation.state === 'submitting' &&
    navigation.formData?.get('action') === 'delete-personal-avatar';

  // Close modal after successful submission
  useEffect(() => {
    if (!isDeleting && showDeletePersonalModal.show) {
      setShowDeletePersonalModal({
        show: false,
        isCurrentAvatar: false,
        avatarName: '',
      });
    }
  }, [isDeleting]);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-light-text/90 retro:text-retro-text/90 multi:text-white/90 dark:text-dark-text/90">
          Avatar
        </h2>
        <span className="text-sm text-light-text/70 retro:text-retro-text/70 multi:text-white/70 dark:text-dark-text/70">
          {totalPoints} Points Available
        </span>
      </div>

      {/* Personal Avatars Grid */}

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
            {personalAvatars.length > 0 &&
              personalAvatars.map((avatar) => (
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
                    <button
                      type="button"
                      onClick={() => {
                        const isCurrentAvatar = user.avatar_url === avatar.url;
                        console.log('Delete clicked for avatar:', {
                          name: avatar.name,
                          isCurrentAvatar,
                          userAvatar: user.avatar_url,
                          avatarUrl: avatar.url,
                        });

                        setShowDeletePersonalModal({
                          show: true,
                          avatarName: avatar.name,
                          isCurrentAvatar,
                        });
                      }}
                      className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                      title={
                        user.avatar_url === avatar.url
                          ? 'Remove as avatar'
                          : 'Delete picture'
                      }
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
                  </div>
                </div>
              ))}
          </div>
        </div>

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
                {ANIMATED_AVATARS.map((avatar) => {
                  const isLocked = checkAvatarLock(
                    avatar,
                    achievements,
                    totalPoints,
                  );
                  const lockReason = getLockReason(
                    avatar,
                    achievements,
                    totalPoints,
                  );

                  return (
                    <div
                      key={avatar.id}
                      className={cn(
                        'group relative w-full max-w-[100px]',
                        isLocked && 'opacity-50',
                      )}
                    >
                      <div className="aspect-square">
                        <AnimatedAvatar
                          url={avatar.url}
                          size="lg"
                          className="h-full w-full"
                        />
                      </div>

                      {isLocked ? (
                        <LockOverlay lockReason={lockReason} />
                      ) : (
                        <Form method="post" action="/settings">
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
                            className="absolute inset-0 rounded-full border-2 border-transparent transition-all hover:border-light-accent"
                            title={avatar.preview}
                          />
                        </Form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-medium text-light-text/70 dark:text-dark-text/70">
                Static Avatars
              </h4>
              <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
                {STATIC_AVATARS.map((avatar) => {
                  const isLocked = checkAvatarLock(
                    avatar,
                    achievements,
                    totalPoints,
                  );
                  const lockReason = getLockReason(
                    avatar,
                    achievements,
                    totalPoints,
                  );

                  return (
                    <div
                      key={avatar.id}
                      className={cn(
                        'group relative w-full max-w-[100px]',
                        isLocked && 'opacity-50',
                      )}
                    >
                      <div className="aspect-square overflow-hidden rounded-full">
                        <img
                          src={avatar.url}
                          alt={avatar.preview}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {isLocked ? (
                        <LockOverlay lockReason={lockReason} />
                      ) : (
                        <Form method="post" action="/settings">
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
                            className="absolute inset-0 rounded-full border-2 border-transparent transition-all hover:border-light-accent"
                            title={avatar.preview}
                          />
                        </Form>
                      )}
                    </div>
                  );
                })}
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

      {/* Delete Personal Avatar Modal */}
      <Modal
        isOpen={showDeletePersonalModal.show}
        onClose={() =>
          setShowDeletePersonalModal({
            show: false,
            avatarName: showDeletePersonalModal.avatarName,
            isCurrentAvatar: showDeletePersonalModal.isCurrentAvatar,
          })
        }
        title={
          showDeletePersonalModal.isCurrentAvatar
            ? 'Remove Current Avatar'
            : 'Delete Uploaded Picture'
        }
        maxWidth="400px"
      >
        <div className="space-y-4">
          <p className="text-sm text-light-text/80">
            {showDeletePersonalModal.isCurrentAvatar
              ? 'This will remove this picture as your current avatar. The picture will remain in your collection.'
              : 'Are you sure you want to permanently delete this picture from your collection? This action cannot be undone.'}
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setShowDeletePersonalModal({
                  show: false,
                  avatarName: showDeletePersonalModal.avatarName,
                  isCurrentAvatar: showDeletePersonalModal.isCurrentAvatar,
                })
              }
              className="px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
            >
              Cancel
            </button>
            <Form
              method="post"
              onSubmit={(e) => {
                const form = e.currentTarget;
                const avatarName = form.querySelector<HTMLInputElement>(
                  'input[name="avatar_name"]',
                )?.value;
                console.log('Form submission:', {
                  action: form.querySelector<HTMLInputElement>(
                    'input[name="action"]',
                  )?.value,
                  avatarName,
                });
              }}
            >
              <input
                type="hidden"
                name="action"
                value={
                  showDeletePersonalModal.isCurrentAvatar
                    ? 'remove-avatar'
                    : 'delete-personal-avatar'
                }
              />
              <input
                type="hidden"
                name="avatar_name"
                value={showDeletePersonalModal.avatarName}
              />
              {showDeletePersonalModal.isCurrentAvatar && (
                <input
                  type="hidden"
                  name="current_avatar_url"
                  value={user.avatar_url || ''}
                />
              )}
              <button
                type="submit"
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-red-600"
              >
                {showDeletePersonalModal.isCurrentAvatar
                  ? 'Remove Avatar'
                  : 'Delete Picture'}
              </button>
            </Form>
          </div>
        </div>
      </Modal>
    </section>
  );
}
