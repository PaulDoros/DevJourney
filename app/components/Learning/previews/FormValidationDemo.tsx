import { useState } from 'react';
import { Button } from '~/components/ui/Button';

export default function FormValidationDemo() {
  const [email, setEmail] = useState('');

  return (
    <form className="space-y-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full rounded-md border p-2"
        />
      </div>
      <Button type="submit">Validate</Button>
    </form>
  );
}
