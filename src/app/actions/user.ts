'use server';

import { cookies } from 'next/headers';
import { getSession } from '../lib/sessions';

const NEST_BASE_URL = process.env.NEXT_PUBLIC_NEST_BASE_URL!;

/**
 * Fetch user profile from backend using access token
 * and update the session with user data
 */
export async function fetchAndUpdateUserProfile() {
	const session = await getSession(await cookies());

	if (!session.accessToken || !session.isLoggedIn) {
		return { error: 'Not authenticated' };
	}

	try {
		// Fetch user profile from backend
		const res = await fetch(`${NEST_BASE_URL}/auth/profile`, {
			headers: {
				Authorization: `Bearer ${session.accessToken}`,
			},
		});

		if (!res.ok) {
			if (res.status === 401) {
				// Token might be expired, clear session
				session.isLoggedIn = false;
				session.accessToken = undefined;
				session.user = undefined;
				await session.save();
				return { error: 'Token expired' };
			}
			return { error: 'Failed to fetch profile' };
		}

		const userData = await res.json();

		// Update session with user data
		session.user = {
			id: userData.id || userData.sub,
			name: userData.name || userData.username,
			email: userData.email,
			username: userData.username,
		};

		await session.save();
		return { user: session.user };
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return { error: 'Failed to fetch user profile' };
	}
}

/**
 * Get current user from session (for client components)
 */
export async function getCurrentUser() {
	const session = await getSession(await cookies());

	if (!session.isLoggedIn) {
		return null;
	}

	// If user data not in session, fetch it
	if (!session.user && session.accessToken) {
		const result = await fetchAndUpdateUserProfile();
		if ('user' in result) {
			return result.user;
		}
		return null;
	}

	return session.user || null;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
	const session = await getSession(await cookies());
	return session.isLoggedIn === true;
}

/**
 * Get access token (for making authenticated API calls)
 */
export async function getAccessToken() {
	const session = await getSession(await cookies());
	return session.accessToken;
}