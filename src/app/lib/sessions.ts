// lib/sessions.ts
import { getIronSession, type SessionOptions } from 'iron-session';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// What we store in the cookie (keep this tiny)
export type SessionData = {
	accessToken?: string;
	isLoggedIn?: boolean;
	user?: {
		id: string;
		name: string;
		email: string;
		username?: string;
	};
};

// Base options; we'll override ttl per-request when needed
export const sessionOptions: SessionOptions = {
	password: process.env.SESSION_PASSWORD!, // must be 32+ chars
	cookieName: 'auth_session',
	cookieOptions: {
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		// httpOnly is enabled by iron-session by default
	},
	ttl: 60 * 15, // default 15 minutes
};

// IMPORTANT: this helper does NOT call cookies() itself.
// Callers (actions/route handlers) must pass the request's cookie store.
export function getSession(cookieStore: ReadonlyRequestCookies) {
	return getIronSession<SessionData>(cookieStore, sessionOptions);
}
