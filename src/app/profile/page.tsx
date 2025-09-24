import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuth } from '../lib/auth-helpers';
import { logOut } from '../actions/auth';

/**
 * Profile Page with Logout
 * Protected route that shows user profile
 */
export default async function ProfilePage() {
	const session = await requireAuth();

	async function handleLogout() {
		'use server';
		await logOut();
		redirect('/');
	}

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">User Profile</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage your profile information and account settings
					</p>
				</div>

				{/* Profile Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-semibold">Profile Information</h2>
						<div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
							{session.user?.name?.charAt(0) || session.user?.username?.charAt(0) || 'U'}
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Full Name
							</label>
							<div className="text-lg">{session.user?.name || 'Not provided'}</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Username
							</label>
							<div className="text-lg">{session.user?.username || 'Not provided'}</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Email Address
							</label>
							<div className="text-lg">{session.user?.email || 'Not provided'}</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								User ID
							</label>
							<div className="text-lg font-mono">{session.user?.id || 'Not provided'}</div>
						</div>

						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
								Session Status
							</label>
							<div className="flex items-center gap-2">
								<span
									className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
										session.isLoggedIn
											? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
											: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
									}`}
								>
									{session.isLoggedIn ? '✓ Active' : '✗ Inactive'}
								</span>
								{session.accessToken && (
									<span className="text-sm text-gray-500 dark:text-gray-400">
										Token: {session.accessToken.slice(0, 20)}...
									</span>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Actions */}
				<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
					<h3 className="font-semibold mb-4">Quick Actions</h3>
					<div className="flex flex-wrap gap-4">
						<Link
							href="/settings"
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Account Settings
						</Link>
						<Link
							href="/dashboard"
							className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
						>
							Dashboard
						</Link>
						<form action={handleLogout}>
							<button
								type="submit"
								className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
							>
								Logout
							</button>
						</form>
					</div>
				</div>

				{/* Debug Info */}
				<details className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6">
					<summary className="cursor-pointer font-semibold">
						Debug Information (Development Only)
					</summary>
					<div className="mt-4">
						<h4 className="font-medium mb-2">Full Session Data:</h4>
						<pre className="text-xs overflow-auto bg-white dark:bg-gray-800 p-4 rounded">
							{JSON.stringify(session, null, 2)}
						</pre>
					</div>
				</details>

				{/* Navigation */}
				<div className="mt-8">
					<Link
						href="/"
						className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}