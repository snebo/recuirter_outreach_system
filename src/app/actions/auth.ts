// actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { FormState, logInFormSchema, signUpFormSchema } from '../lib/definitions';
import { getSession, sessionOptions } from '../lib/sessions';
import { fetchAndUpdateUserProfile } from './user';

const NEST_BASE_URL = process.env.NEXT_PUBLIC_NEST_BASE_URL!;

/** -----------------------
 *  SIGN UP
 *  ----------------------*/
export async function signUp(_state: FormState, formData: FormData): Promise<FormState> {
	// Normalize form
	const form = {
		username: formData.get('username'),
		email: formData.get('email'),
		password: formData.get('password'),
		confirmPassword: formData.get('confirmPassword'),
		rememberMe: formData.get('rememberMe') === 'on',
	};

	// Validate
	const parsed = signUpFormSchema.safeParse(form);
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

	const { username, email, password, rememberMe } = parsed.data;

	try {
		const res = await fetch(`${NEST_BASE_URL}/auth/signup`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username, email, password, rememberMe }),
		});

		if (!res.ok) {
			return { errors: { _form: ['Registration failed'] } };
		}

		const { access_token } = await res.json();

		const session = await getSession(await cookies());
		session.accessToken = access_token;
		session.isLoggedIn = true;

		// per-request TTL ("remember me")
		const shortTtl = 60 * 15; // 15 mins
		const longTtl = 60 * 60 * 24 * 7; // 7 days
		session.updateConfig({ ...sessionOptions, ttl: rememberMe ? longTtl : shortTtl });

		await session.save(); // writes Set-Cookie

		// Fetch and save user profile
		await fetchAndUpdateUserProfile();

		return { message: 'Registration successful', shouldRedirect: true };
	} catch (err) {
		console.error(err);
		return { errors: { _form: ['Unexpected error'] } };
	}
}

/** -----------------------
 *  LOG IN
 *  ----------------------*/
export async function logIn(_state: FormState, formData: FormData): Promise<FormState> {
	const form = {
		username: formData.get('username'),
		password: formData.get('password'),
		// TODO: add rememberMe
		rememberMe: formData.get('rememberMe') === 'on',
	};

	const parsed = logInFormSchema.safeParse(form);
	if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

	const { username, password, rememberMe } = parsed.data as {
		username?: string;
		password: string;
		rememberMe?: boolean;
	};

	try {
		const res = await fetch(`${NEST_BASE_URL}/auth/login`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});

		if (!res.ok) {
			if (res.status === 404 && res.statusText === 'Not Found') {
				return { errors: { _form: ['Invalid credentials'] } };
			}
			return { errors: { _form: ['Login failed'] } };
		}

		const { access_token } = await res.json();

		// find/create cookies
		const session = await getSession(await cookies());
		session.accessToken = access_token; // keep this key name consistent
		session.isLoggedIn = true;

		// per-request TTL ("remember me")
		const shortTtl = 60 * 15;
		const longTtl = 60 * 60 * 24 * 7;
		session.updateConfig({ ...sessionOptions, ttl: rememberMe ? longTtl : shortTtl });

		await session.save(); // writes Set-Cookie

		// Fetch and save user profile
		await fetchAndUpdateUserProfile();

		return { message: 'Login successful', shouldRedirect: true };
	} catch (err) {
		console.error(err);
		return { errors: { _form: ['Unexpected error'] } };
	}
}

/** -----------------------
 *  READ TOKEN LATER
 *  ----------------------*/
export async function getTokenFromCookies() {
	const session = await getSession(await cookies());
	return session.accessToken; // same key name as when saving
}

/** -----------------------
 *  LOG OUT
 *  ----------------------*/
export async function logOut(): Promise<{ message?: string }> {
	const session = await getSession(await cookies());
	await session.destroy();
	return { message: 'Logged out' };
}
