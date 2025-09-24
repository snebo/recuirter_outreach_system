import Link from 'next/link';
import { requireAuth } from '../lib/auth-helpers';

/**
 * Protected Dashboard Page
 * This page requires authentication
 */
export default async function DashboardPage() {
	// This will redirect to login if not authenticated
	const session = await requireAuth();

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
					<p className="text-gray-600 dark:text-gray-400">
						This is a protected page. You can only see this if you're logged in.
					</p>
				</div>

				{/* User Info Card */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">User Information</h2>
					<div className="space-y-2">
						<div>
							<span className="font-medium">Name:</span> {session.user?.name || 'N/A'}
						</div>
						<div>
							<span className="font-medium">Email:</span> {session.user?.email || 'N/A'}
						</div>
						<div>
							<span className="font-medium">Username:</span> {session.user?.username || 'N/A'}
						</div>
						<div>
							<span className="font-medium">User ID:</span> {session.user?.id || 'N/A'}
						</div>
						<div>
							<span className="font-medium">Has Token:</span>{' '}
							{session.accessToken ? '✅ Yes' : '❌ No'}
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
						<h3 className="font-semibold mb-2">Profile Settings</h3>
						<p className="text-sm mb-4">View and edit your profile information</p>
						<Link
							href="/profile"
							className="text-blue-600 dark:text-blue-400 hover:underline"
						>
							Go to Profile →
						</Link>
					</div>

					<div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
						<h3 className="font-semibold mb-2">Account Settings</h3>
						<p className="text-sm mb-4">Manage your account preferences</p>
						<Link
							href="/settings"
							className="text-green-600 dark:text-green-400 hover:underline"
						>
							Go to Settings →
						</Link>
					</div>

					<div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
						<h3 className="font-semibold mb-2">API Test</h3>
						<p className="text-sm mb-4">Test the protected API endpoint</p>
						<Link
							href="/api/user"
							className="text-purple-600 dark:text-purple-400 hover:underline"
						>
							Test API →
						</Link>
					</div>
				</div>

				{/* Session Details */}
				<details className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6">
					<summary className="cursor-pointer font-semibold">
						View Session Details (Debug)
					</summary>
					<pre className="mt-4 text-xs overflow-auto">
						{JSON.stringify(
							{
								isLoggedIn: session.isLoggedIn,
								hasToken: !!session.accessToken,
								user: session.user,
								tokenPreview: session.accessToken ? `${session.accessToken.slice(0, 20)}...` : null,
							},
							null,
							2
						)}
					</pre>
				</details>

				{/* Navigation */}
				<div className="mt-8 flex gap-4">
					<Link
						href="/"
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
					>
						← Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}