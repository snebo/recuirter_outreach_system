'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/app/actions/user';

/**
 * UserInfo Component
 * Client component that displays current user information
 */
export function UserInfo() {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getCurrentUser()
			.then((userData) => {
				setUser(userData);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className="inline-flex items-center gap-2">
				<div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
				<span className="text-sm">Loading...</span>
			</div>
		);
	}

	if (!user) {
		return (
			<span className="text-sm text-gray-500">Not logged in</span>
		);
	}

	return (
		<div className="inline-flex items-center gap-2">
			<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
				{user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
			</div>
			<span className="text-sm font-medium">
				{user.name || user.username || 'User'}
			</span>
		</div>
	);
}