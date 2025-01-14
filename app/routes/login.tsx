import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/Button";
import { Card } from "~/components/ui/Card";
import { Text } from "~/components/ui/Text";
import {
  createGuestUser,
  createUser,
  createUserSession,
} from "~/utils/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "guest") {
      const user = await createGuestUser();
      return createUserSession(user.id, "/dashboard");
    }

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    const user = await createUser(username, email, password);
    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    return json({ error: "Something went wrong" }, { status: 500 });
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-screen items-center justify-center p-4"
    >
      <Card className="w-full max-w-md">
        <Text variant="heading" className="text-center mb-8">
          Welcome Back
        </Text>

        <Form method="post" className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {actionData?.error && (
            <div className="text-red-500 text-sm">{actionData.error}</div>
          )}

          <div className="space-y-4">
            <Button
              type="submit"
              name="intent"
              value="login"
              className="w-full"
            >
              Sign In
            </Button>

            <Button
              type="submit"
              name="intent"
              value="guest"
              variant="secondary"
              className="w-full"
            >
              Continue as Guest
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
}
