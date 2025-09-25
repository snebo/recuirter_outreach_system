'use client';
import { logOut } from '@/app/actions/auth';
import { LogOut, Menu, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function Navbar({ username }: { username: string }) {
	const onLogout = async () => {
		try {
			await logOut();
			window.location.href = '/';
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<nav className="sticky top-0 z-30 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
				{/* Brand */}
				<Link href="/" className="flex items-center gap-2">
					<div className="grid h-8 w-8 place-items-center rounded-md bg-violet-600 text-white shadow-lg">
						O
					</div>
					<span className="text-base font-semibold tracking-tight">Outreach System</span>
				</Link>

				{/* Right actions */}
				<div className="flex items-center gap-2">
					<span className="hidden text-sm text-gray-600 sm:block">Hi, {username}</span>
					<Link
						href="/profile"
						className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-gray-50"
					>
						<UserIcon className="h-4 w-4" /> Profile
					</Link>
					<button
						onClick={onLogout}
						className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-3 py-2 text-sm font-medium text-white shadow transition hover:bg-rose-600"
					>
						<LogOut className="h-4 w-4" /> Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
