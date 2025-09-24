'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '../actions/auth';
import { FormState } from '../lib/definitions';

const initialState: FormState = { errors: {}, message: undefined };
export default function SignUpForm() {
	const [state, action, pending] = useActionState(signUp, initialState);
	const router = useRouter();

	// Handle redirect after successful signup
	useEffect(() => {
		if (state?.shouldRedirect) {
			setTimeout(() => {
				router.push('/');
			}, 2000); // 2 second delay
		}
	}, [state?.shouldRedirect, router]);

	return (
		<form action={action} noValidate>
			{state?.errors?._form?.length ? (
				<div
					role="alert"
					aria-live="polite"
					className="mb-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
				>
					{state.errors._form.map((err, i) => (
						<p key={i}>{err}</p>
					))}
				</div>
			) : null}
			{/* if successful */}
			{state?.message ? (
				<div
					role="status"
					aria-live="polite"
					className="mb-3 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800"
				>
					{state.message}
				</div>
			) : null}
			<div className="mb-4">
				<label htmlFor="email" className="block text-sm font-medium">
					Email
				</label>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="email"
					className="mt-1 block w-full rounded border p-2"
					aria-invalid={Boolean(state?.errors?.email?.length) || undefined}
					aria-describedby={state?.errors?.email?.length ? 'email-error' : undefined}
				/>
				{state?.errors?.email?.map((err, i) => (
					<p id="email-error" key={i} className="mt-1 text-xs text-red-700">
						{err}
					</p>
				))}
			</div>

			<div className="mb-4">
				<label htmlFor="username" className="block text-sm font-medium">
					Username
				</label>
				<input
					type="text"
					name="username"
					id="username"
					className="mt-1 block w-full rounded border p-2"
					aria-invalid={Boolean(state?.errors?.username?.length) || undefined}
					aria-describedby={state?.errors?.username?.length ? 'username-error' : undefined}
				/>
				{state?.errors?.username?.map((err, i) => (
					<p id="username-error" key={i} className="mt-1 text-xs text-red-700">
						{err}
					</p>
				))}
			</div>

			<div className="mb-6">
				<label htmlFor="password" className="block text-sm font-medium">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					className="mt-1 block w-full rounded border p-2"
					aria-invalid={Boolean(state?.errors?.password?.length) || undefined}
					aria-describedby={state?.errors?.password?.length ? 'password-error' : undefined}
				/>
				{state?.errors?.password?.map((err, i) => (
					<p id="password-error" key={i} className="mt-1 text-xs text-red-700">
						{err}
					</p>
				))}
			</div>

			<div className="mb-6">
				<label htmlFor="confirmPassword" className="block text-sm font-medium">
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					className="mt-1 block w-full rounded border p-2"
					aria-invalid={Boolean(state?.errors?.confirmPassword?.length) || undefined}
					aria-describedby={
						state?.errors?.confirmPassword?.length ? 'confirmPassword-error' : undefined
					}
				/>
				{state?.errors?.confirmPassword?.map((err, i) => (
					<p id="confirmPassword-error" key={i} className="mt-1 text-xs text-red-700">
						{err}
					</p>
				))}
			</div>

			<div className="">
				<label htmlFor="rememberMe">Remember Me: </label>
				<input id="rememberMe" name="rememberMe" type="checkbox" />
			</div>
			{state?.errors?.rememberMe && <p>{state.errors.rememberMe}</p>}

			<button
				type="submit"
				disabled={pending}
				className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
			>
				{pending ? 'Registering you…' : 'Sign Up'}
			</button>
		</form>
	);
}
