'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { isAuthenticated } from '@/app/actions/user';

/**
 * AuthStatus Component
 * Shows authentication status with login/logout links
 */
export function AuthStatus() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		isAuthenticated()
			.then(setIsLoggedIn)
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="flex items-center gap-2">
				<div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
				<span className="text-sm text-gray-500">Checking auth...</span>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<div
					className={`w-2 h-2 rounded-full ${
						isLoggedIn ? 'bg-green-500' : 'bg-gray-400'
					}`}
				/>
				<span className="text-sm">
					{isLoggedIn ? 'Authenticated' : 'Not authenticated'}
				</span>
			</div>
			{isLoggedIn ? (
				<Link
					href="/profile"
					className="text-sm text-blue-600 hover:underline"
				>
					View Profile
				</Link>
			) : (
				<Link
					href="/login"
					className="text-sm text-blue-600 hover:underline"
				>
					Login
				</Link>
			)}
		</div>
	);
}