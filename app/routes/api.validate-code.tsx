import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/utils/session.server';
import { checkAndUnlockAchievement } from '~/services/achievements.server';

interface ValidationRule {
  check: (code: string) => boolean;
  message: string;
}

const VALIDATION_RULES: Record<string, ValidationRule[]> = {
  'use-fetcher': [
    {
      check: (code) => code.includes('useFetcher'),
      message: 'Make sure to use the useFetcher hook',
    },
    {
      check: (code) => code.includes('fetcher.Form'),
      message: 'Try using fetcher.Form for the form submission',
    },
    {
      check: (code) => code.includes('isOptimistic'),
      message: 'Add optimistic UI updates using fetcher.state',
    },
  ],
  'loader-data': [
    {
      check: (code) => code.includes('useLoaderData'),
      message: 'Use the useLoaderData hook to access server data',
    },
    {
      check: (code) => code.includes('loader'),
      message: 'Add a loader function to fetch server-side data',
    },
    {
      check: (code) => code.includes('json'),
      message: 'Return data using the json helper',
    },
  ],
  'form-validation': [
    {
      check: (code) => code.includes('formData'),
      message: 'Use formData to handle form submissions',
    },
    {
      check: (code) => code.includes('action'),
      message: 'Add an action attribute to the form',
    },
    {
      check: (code) => code.includes('json'),
      message: 'Return data using the json helper',
    },
  ],
  'nested-routing': [
    {
      check: (code) => code.includes('Outlet'),
      message: 'Use Outlet for nested routing',
    },
    {
      check: (code) => code.includes('layout'),
      message: 'Add a layout component for nested routing',
    },
  ],
};

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const code = formData.get('code') as string;
  const componentId = formData.get('componentId') as string;

  const rules = VALIDATION_RULES[componentId];

  if (!rules) {
    return json({ error: 'Invalid component' }, { status: 400 });
  }

  try {
    // Check each rule and find the first failing one
    const failingRule = rules.find((rule) => !rule.check(code));

    if (failingRule) {
      return json({
        error: `Hint: ${failingRule.message}`,
      });
    }

    // All rules passed
    await checkAndUnlockAchievement(request, user.id, componentId);
    return json({
      success: true,
      message: "Great job! You've mastered this feature! Achievement unlocked!",
    });
  } catch (error) {
    return json({ error: 'Error validating code' }, { status: 500 });
  }
}
