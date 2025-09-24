import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from './sessions';
import { fetchAndUpdateUserProfile } from '../actions/user';

/**
 * Require authentication for protected routes
 * Redirects to login if not authenticated
 */
export async function requireAuth() {
	const session = await getSession(await cookies());

	if (!session.isLoggedIn || !session.accessToken) {
		redirect('/login');
	}

	// If user data not in session, fetch it
	if (!session.user) {
		const result = await fetchAndUpdateUserProfile();
		if ('error' in result) {
			// If token is invalid, redirect to login
			redirect('/login');
		}
	}

	return session;
}

/**
 * Get authenticated session with user data
 * Returns null if not authenticated
 */
export async function getAuthSession() {
	const session = await getSession(await cookies());

	if (!session.isLoggedIn || !session.accessToken) {
		return null;
	}

	// If user data not in session, fetch it
	if (!session.user) {
		const result = await fetchAndUpdateUserProfile();
		if ('error' in result) {
			return null;
		}
	}

	return session;
}

/**
 * Check if request is authenticated
 * Useful for conditional rendering
 */
export async function checkAuth() {
	const session = await getSession(await cookies());
	return {
		isAuthenticated: session.isLoggedIn === true,
		user: session.user,
		hasToken: !!session.accessToken,
	};
}