'use client';
import { logIn } from '@/app/actions/auth';
import { FormState } from '@/app/lib/definitions';
import {
	CheckCircle2,
	Eye,
	EyeOff,
	Facebook,
	Github,
	Leaf,
	Lock,
	Mail,
	TrendingUp,
	Twitter,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect, useState } from 'react';

const initialState: FormState = { errors: {}, message: undefined };

export default function MaterioLogin({
	imageUrl = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2070&auto=format&fit=crop',
}: {
	imageUrl?: string;
	onSubmit?: (data: { email: string; password: string; remember: boolean }) => void;
}) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);

	// original login mecanics
	const [state, action, pending] = useActionState(logIn, initialState);
	const router = useRouter();

	// redirect after login
	useEffect(() => {
		if (state?.shouldRedirect) {
			setTimeout(() => {
				router.push('/');
			}, 2000);
		}
	}, [state?.shouldRedirect, router]);

	return (
		<div className="min-h-screen w-full bg-[#f5f6fb]">
			<div className="mx-auto flex min-h-screen max-w-7xl items-stretch">
				{/* Left visual panel */}
				<div className="relative hidden w-1/2 flex-1 items-center justify-center p-8 lg:flex">
					<div className="absolute inset-0 -z-10">
						<img
							src={imageUrl}
							alt="Illustration"
							className="h-full w-full rounded-r-3xl object-cover shadow-2xl"
						/>
					</div>

					{/* Floating cards */}
					<div className="pointer-events-none select-none">
						<div className="mb-6 inline-flex gap-4">
							<Card>
								<div className="flex items-center gap-2 text-sm text-gray-500">
									<div className="rounded-xl bg-violet-100 p-2">
										<TrendingUp className="h-4 w-4" />
									</div>
									Institutions
								</div>
								<div className="mt-2 text-3xl font-semibold">862</div>
								<div className="text-xs text-gray-400">calls answered</div>
							</Card>
							<Card>
								<div className="text-sm text-gray-500">$86.4k</div>
								<div className="mt-3 h-16 w-24 rounded-lg bg-gradient-to-b from-white to-gray-100" />
								<div className="mt-2 text-xs text-gray-400">Cost saved</div>
							</Card>
						</div>
						<Card>
							<div className="flex items-center gap-2 text-sm text-gray-500">
								<div className="rounded-xl bg-amber-100 p-2">
									<Leaf className="h-4 w-4" />
								</div>
								daily scrapes
							</div>
							<div className="mt-2 text-3xl font-semibold">2,856</div>
							<div className="text-xs text-emerald-500">+18.2%</div>
						</Card>
					</div>
				</div>

				{/* Right form panel */}
				<div className="flex w-full items-center justify-center px-6 py-12 lg:w-[42%] lg:px-12">
					<div className="w-full max-w-md">
						{/* Brand */}
						<div className="mb-8 flex items-center gap-3">
							<div className="grid h-8 w-8 place-items-center rounded-md bg-violet-600 text-white shadow-lg">
								O
							</div>
							<span className="text-xl font-semibold tracking-tight">Outreach System</span>
						</div>

						<h1 className="mb-1 text-2xl font-bold">
							Welcome to our platform! <span className="align-middle">👋🏻</span>
						</h1>
						<p className="mb-8 text-sm text-gray-500">
							Please sign in to your account and streamline your work.
						</p>

						<form action={action} noValidate className="space-y-4">
							{/* Form-level errors */}
							{/* Form-level errors */}
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

							{/* Success message */}
							{state?.message ? (
								<div
									role="status"
									aria-live="polite"
									className="mb-3 rounded border border-green-300 bg-green-50 p-3 text-sm text-green-800"
								>
									{state.message}
								</div>
							) : null}
							<label className="block text-sm font-medium text-gray-700" htmlFor="email">
								Email
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<Mail className="h-5 w-5" />
								</span>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
									aria-invalid={Boolean(state?.errors?.email?.length) || undefined}
									aria-describedby={state?.errors?.email?.length ? 'email-error' : undefined}
								/>
								{state?.errors?.email?.map((err, i) => (
									<p id="email-error" key={i} className="mt-1 text-xs text-red-700">
										{err}
									</p>
								))}
							</div>

							<label className="block text-sm font-medium text-gray-700" htmlFor="password">
								Password
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<Lock className="h-5 w-5" />
								</span>
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-11 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
								/>
								<button
									type="button"
									aria-label={showPassword ? 'Hide password' : 'Show password'}
									onClick={() => setShowPassword((s) => !s)}
									className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
								>
									{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
							</div>

							<div className="flex items-center justify-between pt-1">
								<label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700">
									<input
										type="checkbox"
										id="remember"
										name="remember"
										checked={remember}
										onChange={(e) => setRemember(e.target.checked)}
										className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
									/>
									Remember me
								</label>
								<a href="#forgot" className="text-sm text-violet-600 hover:underline">
									Forgot password?
								</a>
							</div>

							<button
								type="submit"
								disabled={pending}
								className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-medium text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:opacity-70"
							>
								{pending ? (
									<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
										/>
									</svg>
								) : (
									<CheckCircle2 className="h-5 w-5" />
								)}
								<span>{pending ? 'Logging in...' : 'Log In'}</span>
							</button>

							<p className="text-center text-sm text-gray-600">
								New on our platform?{' '}
								<Link href="/register" className="font-medium text-violet-600 hover:underline">
									Create an account
								</Link>
							</p>

							<div className="flex items-center gap-3">
								<div className="h-px flex-1 bg-gray-200" />
								<span className="text-xs uppercase tracking-wider text-gray-400">or</span>
								<div className="h-px flex-1 bg-gray-200" />
							</div>
							<div className="flex items-center justify-center gap-4">
								<SocialButton label="Sign in with Twitter" href="#twitter">
									<Twitter className="h-5 w-5" />
								</SocialButton>
								<SocialButton label="Sign in with Facebook" href="#facebook">
									<Facebook className="h-5 w-5" />
								</SocialButton>
								<SocialButton label="Sign in with GitHub" href="#github">
									<Github className="h-5 w-5" />
								</SocialButton>
							</div>
						</form>

						<a
							href="#buy"
							className="group fixed bottom-6 right-6 inline-flex items-center gap-3 rounded-2xl bg-rose-500 px-5 py-3 font-semibold text-white shadow-2xl transition hover:bg-rose-600"
						>
							<span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-white">
								💳
							</span>
							Buy Now
							<span className="absolute -z-10 ml-24 h-16 w-28 rounded-full bg-rose-400/40 blur-2xl transition group-hover:bg-rose-400/60" />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

function Card({ children }: { children: React.ReactNode }) {
	return (
		<div className="m-2 inline-flex w-40 flex-col rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur-sm">
			{children}
		</div>
	);
}

function SocialButton({
	children,
	href = '#',
	label,
}: {
	children: React.ReactNode;
	href?: string;
	label: string;
}) {
	return (
		<a
			href={href}
			aria-label={label}
			className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
		>
			{children}
		</a>
	);
}
