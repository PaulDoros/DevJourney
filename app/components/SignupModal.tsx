import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/Button';
import { Modal } from '~/components/ui/Modal';

// Define props interface for type safety and documentation
interface SignupModalProps {
  isOpen: boolean; // Controls the visibility of the signup modal
  onClose: () => void; // Function to call when modal should close
}

/**
 * SignupModal Component
 *
 * A modal component that handles user registration with a form.
 * Uses the reusable Modal component for consistent styling and behavior.
 *
 * @component
 * @example
 * ```tsx
 * <SignupModal
 *   isOpen={showSignup}
 *   onClose={() => setShowSignup(false)}
 * />
 * ```
 */
export function SignupModal({ isOpen, onClose }: SignupModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create an Account">
      {/* Signup form using Remix's Form component for handling submissions */}
      <Form method="post" className="space-y-4">
        {/* Hidden input to identify the form's intent on the server */}
        <input type="hidden" name="intent" value="signup" />

        {/* Username field */}
        <div>
          <label className="mb-2 block text-sm font-medium">Username</label>
          <input
            type="text"
            name="username"
            className="w-full rounded border p-2"
            required
            aria-label="Username"
          />
        </div>

        {/* Email field */}
        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded border p-2"
            required
            aria-label="Email address"
          />
        </div>

        {/* Password field */}
        <div>
          <label className="mb-2 block text-sm font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full rounded border p-2"
            required
            aria-label="Password"
          />
        </div>

        {/* Confirm Password field */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full rounded border p-2"
            required
            aria-label="Confirm password"
          />
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </Form>
    </Modal>
  );
}

/* Styling notes:
 * - space-y-4: Adds vertical spacing between form elements
 * - w-full: Makes elements take full width of container
 * - rounded: Adds border radius to inputs
 * - mb-2: Adds margin bottom to labels
 * - text-sm: Sets smaller text size for labels
 * - font-medium: Sets font weight for labels
 */

/* Usage example:
 * ```tsx
 * const [showSignup, setShowSignup] = useState(false);
 *
 * return (
 *   <SignupModal
 *     isOpen={showSignup}
 *     onClose={() => setShowSignup(false)}
 *   />
 * );
 * ```
 */
