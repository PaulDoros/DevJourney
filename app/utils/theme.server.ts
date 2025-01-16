import { createCookie } from '@remix-run/node';

// Create a cookie instance for theme storage
export const themeCookie = createCookie('theme', {
  path: '/',
  sameSite: 'lax',
  // Theme preference isn't sensitive, so we don't need httpOnly
  httpOnly: false,
});

// Valid theme types
export type Theme = 'light' | 'dark' | 'retro' | 'multi';

// Get theme from cookie
export async function getTheme(request: Request): Promise<Theme> {
  const cookieHeader = request.headers.get('Cookie');
  const theme = await themeCookie.parse(cookieHeader);
  // Return the theme if valid, otherwise default to 'light'
  return isValidTheme(theme) ? theme : 'light';
}

// Validate theme value
function isValidTheme(theme: unknown): theme is Theme {
  return (
    typeof theme === 'string' &&
    ['light', 'dark', 'retro', 'multi'].includes(theme)
  );
}
