import { Modal } from '~/components/ui/Modal';
import { Button } from '~/components/ui/Button';

interface FirstAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FirstAchievementModal({
  isOpen,
  onClose,
}: FirstAchievementModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🎉 First Achievement Unlocked!"
    >
      <div className="mt-2">
        <p className="text-sm text-light-text/80 retro:text-retro-text/80 multi:text-multi-text/80 dark:text-dark-text/80">
          Welcome to our achievement system! You've just unlocked your first
          achievement by creating an account. Achievements can be earned by:
        </p>

        <ul className="mt-2 list-inside list-disc text-sm text-light-text/80 retro:text-retro-text/80 multi:text-multi-text/80 dark:text-dark-text/80">
          <li>Completing specific actions</li>
          <li>Using different features</li>
          <li>Reaching milestones</li>
        </ul>

        <p className="mt-2 text-sm text-light-text/80 retro:text-retro-text/80 multi:text-multi-text/80 dark:text-dark-text/80">
          Unlock more achievements to gain access to exclusive avatars and
          features!
        </p>
      </div>

      <div className="mt-4">
        <Button onClick={onClose}>Got it!</Button>
      </div>
    </Modal>
  );
}
