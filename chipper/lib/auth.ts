/**
 * Authentication Utilities for managing JWT tokens in the browser.
 * These functions use localStorage and assume they are running in a client environment (browser).
 */

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export async function login(username: string, password: string): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        // Attempt to extract a specific error message if available, otherwise default
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid credentials');
    }

    const { token } = await res.json();
    setToken(token);
    return token;
  } catch { // FIX: Removed the unused 'error' variable here to resolve the ESLint warning.
    // Throw a generic error for security/simplicity after a failed attempt
    throw new Error('Login failed');
  }
}
