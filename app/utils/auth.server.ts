// Import necessary dependencies from Remix and local files
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { supabase } from "./supabase.server"; // Supabase client instance
import type { Achievement, User } from "~/types/user"; // TypeScript types

// Session management configuration
// Cookies are small pieces of data stored in the browser that help maintain state
// They are used here to keep track of authenticated users across requests
// HTTP-only cookies cannot be accessed by JavaScript, making them more secure against XSS attacks
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // The name of the cookie stored in the browser
    sameSite: "lax", // Controls how cookie is sent with cross-site requests (prevents CSRF)
    path: "/", // The cookie will be available for all paths in the domain
    httpOnly: true, // Makes cookie inaccessible to browser's JavaScript (security feature)
    secrets: [process.env.SESSION_SECRET || "s3cr3t"], // Secret keys used to sign the cookie to prevent tampering
    secure: process.env.NODE_ENV === "production", // Cookie only sent over HTTPS in production
  },
});

// Creates a new session for a user and redirects them
// getSession() creates or retrieves a session object that can store data
// commitSession() serializes the session data into a cookie string
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession(); // Create/get session object
  session.set("userId", userId); // Store user ID in session data
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session), // Convert session to cookie header
    },
  });
}

// User Management Functions

// Creates a temporary guest user account
// Math.random() generates a number between 0 and 1
// Math.floor() rounds down to nearest integer
// This combination creates a random number between 0 and 9999 for guest usernames
export async function createGuestUser() {
  const guestUser = {
    username: `Guest-${Math.floor(Math.random() * 10000)}`, // Generate random guest ID
    isGuest: true, // Boolean flag to identify guest accounts
    points: 0, // Initial points counter for gamification
    achievements: [], // Empty array to store future achievements
    createdAt: new Date().toISOString(), // Current timestamp in ISO format (e.g., "2024-01-20T15:30:00.000Z")
  };

  // Insert guest user into database
  // .single() ensures we get a single record back instead of an array
  const { data: user, error } = await supabase
    .from("users")
    .insert([guestUser])
    .select()
    .single();

  if (error) throw error;
  return user;
}

// Creates a new permanent user account with authentication
// This is a two-step process:
// 1. Create auth user (handles email/password)
// 2. Create user profile (stores additional user data)
export async function createUser(
  username: string, // Display name chosen by user
  email: string, // User's email for authentication
  password: string, // User's password (will be hashed by Supabase)
) {
  // First create the authentication user in Supabase Auth system
  // signUp handles password hashing and email verification
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  // Then create the user profile in our users table
  // This stores additional user data beyond authentication
  const { data: user, error: profileError } = await supabase
    .from("users")
    .insert([
      {
        id: authData.user?.id, // Link profile to auth user using their ID
        username,
        email,
        isGuest: false, // Permanent account, not a guest
        points: 0, // Starting points
        achievements: [], // Empty achievements array
        createdAt: new Date().toISOString(), // Timestamp of account creation
      },
    ])
    .select()
    .single();

  if (profileError) throw profileError;
  return user;
}

// Retrieves a user by their ID
// Returns Promise<User | null> meaning it will return either a User object or null
// The asterisk (*) in select("*") means select all columns from the table
export async function getUserById(userId: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from("users")
    .select("*") // Select all user fields
    .eq("id", userId) // 'eq' means equals - find where id matches userId
    .single(); // Get single record (throws error if multiple found)

  if (error) return null;
  return user;
}

// Updates a user's points in the database
// Used for gamification features
// Returns the updated user object
export async function updateUserPoints(userId: string, points: number) {
  const { data, error } = await supabase
    .from("users")
    .update({ points }) // Set the points field to new value
    .eq("id", userId) // Update where id matches
    .select() // Return the updated record
    .single(); // Expect one result

  if (error) throw error;
  return data;
}

// Adds a new achievement to a user's achievement list
// Achievements are stored as a JSONB array in the database
// This function handles adding new achievements while preserving existing ones
export async function addAchievement(userId: string, achievement: Achievement) {
  // First retrieve current achievements
  const { data: user } = await supabase
    .from("users")
    .select("achievements") // Only need achievements column
    .eq("id", userId)
    .single();

  // Create new achievements array
  // The spread operator (...) is used to copy existing achievements
  // || [] provides empty array fallback if achievements is null
  const updatedAchievements = [
    ...(user?.achievements || []),
    {
      ...achievement, // Copy all achievement properties
      unlockedAt: new Date().toISOString(), // Add timestamp when achievement was earned
    },
  ];

  // Update user record with new achievements array
  const { data, error } = await supabase
    .from("users")
    .update({ achievements: updatedAchievements })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
