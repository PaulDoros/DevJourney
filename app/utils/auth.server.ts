// Import necessary dependencies from Remix and local files
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { supabase } from './supabase.server'; // Supabase client instance
import type { Achievement, User } from '~/types/user'; // TypeScript types
import { createClient } from '@supabase/supabase-js';
import { getEnvVars } from './env.server'; // Add this import
import { createServerSupabase } from '~/utils/supabase';
import { createFolderStructure } from './supabase-storage.server';

// Session management configuration
// Cookies are small pieces of data stored in the browser that help maintain state
// They are used here to keep track of authenticated users across requests
// HTTP-only cookies cannot be accessed by JavaScript, making them more secure against XSS attacks
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session', // The name of the cookie stored in the browser
    sameSite: 'lax', // Controls how cookie is sent with cross-site requests (prevents CSRF)
    path: '/', // The cookie will be available for all paths in the domain
    httpOnly: true, // Makes cookie inaccessible to browser's JavaScript (security feature)
    secrets: [process.env.SESSION_SECRET || 's3cr3t'], // Secret keys used to sign the cookie to prevent tampering
    secure: process.env.NODE_ENV === 'production', // Cookie only sent over HTTPS in production
  },
});

// Get session from request
export async function getSession(request: Request) {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
}

// Get user from session
export async function getUserFromSession(request: Request) {
  const session = await getSession(request);
  const userId = session.get('userId');

  if (!userId) return null;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) return null;

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Creates a new session for a user and redirects them
// getSession() creates or retrieves a session object that can store data
// commitSession() serializes the session data into a cookie string
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set('userId', userId);

  // Set a longer session expiry (optional)
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await sessionStorage.commitSession(session, cookieOptions),
    },
  });
}

// User Management Functions

/**
 * Creates a temporary guest user account
 * Returns a Promise that resolves to the created user or throws an error
 */
export async function createGuestUser() {
  try {
    const timestamp = Date.now();
    const guestUser = {
      username: `Guest-${timestamp}-${Math.floor(Math.random() * 10000)}`,
      email: `guest_${timestamp}@guest.local`,
      is_guest: true,
      points: 0,
      achievements: [],
    };

    // First insert the user
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert(guestUser)
      .select('*'); // Add explicit column selection

    if (insertError || !insertedUser || insertedUser.length === 0) {
      console.error('Guest user creation error:', insertError);
      throw new Error('Failed to create guest user');
    }

    const user = insertedUser[0]; // Get the first user from the array

    // Create a session for the guest user
    return createUserSession(user.id, '/');
  } catch (error) {
    console.error('Guest user creation error:', error);
    throw new Error('Failed to create guest user');
  }
}

// Creates a new permanent user account with authentication
// This is a two-step process:
// 1. Create auth user (handles email/password)
// 2. Create user profile (stores additional user data)
export async function createUser(
  username: string,
  email: string,
  password: string,
) {
  try {
    // First create the authentication user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // Store username in auth metadata
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from auth signup');

    // Then create the user profile
    const { data: user, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id, // Use the auth user's ID
          username,
          email,
          is_guest: false,
          points: 0,
          achievements: [],
        },
      ])
      .select('*')
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      throw profileError;
    }

    // Create storage folder structure for the new user
    await createFolderStructure(user.id);

    return user;
  } catch (error) {
    console.error('User creation error:', error);
    throw error;
  }
}

// Retrieves a user by their ID
// Returns Promise<User | null> meaning it will return either a User object or null
// The asterisk (*) in select("*") means select all columns from the table
export async function getUserById(userId: string): Promise<User | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('*') // Select all user fields
    .eq('id', userId) // 'eq' means equals - find where id matches userId
    .single(); // Get single record (throws error if multiple found)

  if (error) return null;
  return user;
}

// Updates a user's points in the database
// Used for gamification features
// Returns the updated user object
export async function updateUserPoints(userId: string, points: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ points }) // Set the points field to new value
    .eq('id', userId) // Update where id matches
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
    .from('users')
    .select('achievements') // Only need achievements column
    .eq('id', userId)
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
    .from('users')
    .update({ achievements: updatedAchievements })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Add this function to get userId from session
export async function getUserId(request: Request) {
  const session = await getSession(request);
  const userId = session.get('userId');
  if (!userId) return null;
  return userId;
}

export async function requireUser(request: Request) {
  const user = await getUserFromSession(request);

  if (!user) {
    throw redirect('/login');
  }

  return user;
}
