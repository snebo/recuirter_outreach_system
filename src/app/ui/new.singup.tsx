'use client';
import {
	Bot,
	CheckCircle2,
	Eye,
	EyeOff,
	Facebook,
	Github,
	Lock,
	Mail,
	PhoneCall,
	Search,
	Sparkles,
	Twitter,
	User,
	Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useActionState, useEffect, useMemo, useState } from 'react';
import { signUp } from '../actions/auth';

export type SignupPayload = {
	name: string;
	email: string;
	password: string;
	confirm: string;
	agree: boolean;
};

const initialState = {
	errors: {},
	message: undefined,
};
export default function SignupForm({
	onSubmit,
	imageUrl = 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2070&auto=format&fit=crop',
}: {
	onSubmit?: (data: SignupPayload) => void | Promise<void>;
	imageUrl?: string;
}) {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [agree, setAgree] = useState(false);
	const [showPw, setShowPw] = useState(false);
	const [showPw2, setShowPw2] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});

	const [state, action, pending] = useActionState(signUp, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.shouldRedirect) {
			setTimeout(() => {
				router.push('/');
			}, 2000); // 2 second delay
		}
	}, [state?.shouldRedirect, router]);

	const strength = useMemo(() => {
		let s = 0;
		if (password.length >= 8) s++;
		if ([...password].some((c) => c >= 'A' && c <= 'Z')) s++;
		if ([...password].some((c) => c >= 'a' && c <= 'z')) s++;
		if ([...password].some((c) => c >= '0' && c <= '9')) s++;
		if ([...password].some((c) => '!@#$%^&*()-_=+[]{};:\'",.<>/?`~'.includes(c))) s++;
		return s;
	}, [password]);

	return (
		<div className="min-h-screen w-full bg-[#f5f6fb]">
			<div className="mx-auto flex min-h-screen max-w-7xl items-stretch">
				{/* Left visual panel */}
				<div className="relative hidden w-1/2 flex-1 items-center justify-center p-8 lg:flex">
					<div className="absolute inset-0 -z-10">
						<img
							src={imageUrl}
							alt="Healthcare automation"
							className="h-full w-full rounded-r-3xl object-cover shadow-2xl"
						/>
						<div className="absolute inset-0 rounded-r-3xl bg-black/30" />
					</div>

					{/* Floating feature cards */}
					<div className="relative w-full h-full pointer-events-none select-none">
						{/* Auto Dialing */}
						<Card className="absolute top-12 left-10 animate-float-slow bg-white/90 backdrop-blur-md">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="rounded-xl bg-violet-100 p-2">
									<PhoneCall className="h-4 w-4 text-violet-600" />
								</div>
								Auto Dialing
							</div>
							<div className="mt-2 text-xl font-semibold">500+ calls/day</div>
							<div className="text-xs text-gray-400">Scale outreach with ease</div>
						</Card>

						{/* AI Agent */}
						<Card className="absolute top-1/3 right-12 animate-float-fast bg-white/90 backdrop-blur-md">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="rounded-xl bg-emerald-100 p-2">
									<Bot className="h-4 w-4 text-emerald-600" />
								</div>
								AI Agent
							</div>
							<div className="mt-2 text-xl font-semibold">Answers & saves info</div>
							<div className="text-xs text-gray-400">Never miss a call</div>
						</Card>

						{/* Find Professionals */}
						<Card className="absolute bottom-20 left-1/4 animate-float-medium bg-white/90 backdrop-blur-md">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="rounded-xl bg-sky-100 p-2">
									<Search className="h-4 w-4 text-sky-600" />
								</div>
								Find Professionals
							</div>
							<div className="mt-2 text-xl font-semibold">Thousands nearby</div>
							<div className="text-xs text-gray-400">Verified health workers</div>
						</Card>

						{/* Staffing */}
						<Card className="absolute top-1/2 left-16 animate-float-slow bg-white/90 backdrop-blur-md">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="rounded-xl bg-amber-100 p-2">
									<Users className="h-4 w-4 text-amber-600" />
								</div>
								Staffing & Recruitment
							</div>
							<div className="mt-2 text-xl font-semibold">Hire with ease</div>
							<div className="text-xs text-gray-400">On-demand workforce</div>
						</Card>

						{/* Ease of Use */}
						<Card className="absolute bottom-12 right-16 animate-float-medium bg-white/90 backdrop-blur-md">
							<div className="flex items-center gap-2 text-sm text-gray-600">
								<div className="rounded-xl bg-pink-100 p-2">
									<Sparkles className="h-4 w-4 text-pink-600" />
								</div>
								Ease of Use
							</div>
							<div className="mt-2 text-xl font-semibold">Plug & Play</div>
							<div className="text-xs text-gray-400">Simple, intuitive design</div>
						</Card>
					</div>
				</div>

				{/* Right form panel */}
				<div className="flex w-full items-center justify-center px-6 py-2 lg:w-[42%] lg:px-12">
					<div className="w-full max-w-md">
						<div className="mb-3 flex items-center gap-3">
							<div className="grid h-8 w-8 place-items-center rounded-md bg-violet-600 text-white shadow-lg">
								O
							</div>
							<span className="text-xl font-semibold tracking-tight">Outreach System</span>
						</div>
						<h1 className="mb-1 text-2xl font-bold">Create an account</h1>
						<p className="mb-3 text-sm text-gray-500">
							Join us and finding medical professionals...
						</p>

						<form action={action} className="space-y-4" noValidate>
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
							<label className="block text-sm font-medium text-gray-700" htmlFor="username">
								Username
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<User className="h-5 w-5" />
								</span>
								<input
									id="username"
									name="username"
									onChange={(e) => setName(e.target.value)}
									placeholder="Jane Doe"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
									aria-invalid={Boolean(state?.errors?.username?.length) || undefined}
									aria-describedby={state?.errors?.username?.length ? 'username-error' : undefined}
								/>
								{state?.errors?.username?.map((err, i) => (
									<p id="username-error" key={i} className="mt-1 text-xs text-rose-600">
										{err}
									</p>
								))}
							</div>

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
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
									aria-invalid={Boolean(state?.errors?.email?.length) || undefined}
									aria-describedby={state?.errors?.email?.length ? 'email-error' : undefined}
								/>
								{state?.errors?.email?.map((err, i) => (
									<p id="email-error" key={i} className="mt-1 text-xs text-red-600">
										{err}
									</p>
								))}
							</div>

							<label className="block text-sm font-medium text-gray-700" htmlFor="password">
								Password
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/4 -translate-y-1/2 text-gray-400">
									<Lock className="h-5 w-5" />
								</span>
								<input
									id="password"
									name="password"
									type={showPw ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-11 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
									aria-invalid={Boolean(state?.errors?.password?.length) || undefined}
									aria-describedby={state?.errors?.password?.length ? 'password-error' : undefined}
								/>
								<button
									type="button"
									onClick={() => setShowPw((s) => !s)}
									className="absolute right-3 top-1/4 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
								>
									{showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
								<div className="mt-1 h-2 w-full overflow-hidden rounded bg-gray-200">
									<div
										className={
											(strength / 5) * 100 < 50
												? 'h-full bg-rose-500 transition-all'
												: 'h-full bg-green-500 transition-all'
										}
										style={{ width: `${(strength / 5) * 100}%` }}
									/>
								</div>
								<p className="mt-1 text-xs text-gray-500">
									Use 8+ chars, mix upper/lowercase, numbers and symbols.
								</p>
								{state?.errors?.password?.map((err, i) => (
									<p id="password-error" key={i} className="mt-1 text-xs text-red-700">
										{err}
									</p>
								))}
							</div>

							<label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
								Confirm password
							</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<Lock className="h-5 w-5" />
								</span>
								<input
									id="confirmPassword"
									name="confirmPassword"
									type={showPw2 ? 'text' : 'password'}
									value={confirm}
									onChange={(e) => setConfirm(e.target.value)}
									placeholder="••••••••"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-11 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
									aria-invalid={Boolean(state?.errors?.confirmPassword?.length) || undefined}
									aria-describedby={
										state?.errors?.confirmPassword?.length ? 'confirmPassword-error' : undefined
									}
								/>
								<button
									type="button"
									onClick={() => setShowPw2((s) => !s)}
									className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
								>
									{showPw2 ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
								</button>
								{state?.errors?.confirmPassword?.map((err, i) => (
									<p id="confirmPassword-error" key={i} className="mt-1 text-xs text-red-700">
										{err}
									</p>
								))}
							</div>

							<label className="mt-1 inline-flex items-center gap-2 text-sm text-gray-700">
								<input
									type="checkbox"
									checked={agree}
									onChange={(e) => setAgree(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
								/>
								I agree to the{' '}
								<a href="#" className="text-violet-600 hover:underline">
									Terms and Privacy
								</a>
							</label>
							{errors.agree && <p className="-mt-1 text-xs text-rose-600">{errors.agree}</p>}

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
								<span>{submitting ? 'Creating account...' : 'Sign Up'}</span>
							</button>

							<div className="flex items-center gap-3">
								<div className="h-px flex-1 bg-gray-200" />
								<span className="text-xs uppercase tracking-wider text-gray-400">or</span>
								<div className="h-px flex-1 bg-gray-200" />
							</div>
							<div className="flex items-center justify-center gap-4">
								<SocialButton label="Sign up with Twitter" href="#twitter">
									<Twitter className="h-5 w-5" />
								</SocialButton>
								<SocialButton label="Sign up with Facebook" href="#facebook">
									<Facebook className="h-5 w-5" />
								</SocialButton>
								<SocialButton label="Sign up with GitHub" href="#github">
									<Github className="h-5 w-5" />
								</SocialButton>
							</div>

							<p className="text-center text-sm text-gray-600">
								Already have an account?{' '}
								<Link href={'/login'} className="font-medium text-violet-600 hover:underline">
									Log in
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
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

type CardProps = React.HTMLAttributes<HTMLDivElement>;

function Card({ children, className, ...props }: CardProps) {
	return (
		<div className={`px-6 py-3 rounded-xl bg-white shadow ${className ?? ''}`} {...props}>
			{children}
		</div>
	);
}
