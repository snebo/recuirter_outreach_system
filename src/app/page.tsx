import Image from 'next/image';
import Link from 'next/link';
import { checkAuth } from './lib/auth-helpers';
import { fetchAndUpdateUserProfile } from './actions/user';

export default async function Home() {
	const auth = await checkAuth();

	// If authenticated but no user data, fetch it
	if (auth.isAuthenticated && !auth.user) {
		const result = await fetchAndUpdateUserProfile();
		if ('user' in result) {
			auth.user = result.user;
		}
	}

	return (
		<div className="font-sans min-h-screen p-8 pb-20 sm:p-20">
			{/* Auth Status Bar */}
			<div className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
				{auth.isAuthenticated ? (
					<div className="flex justify-between items-center">
						<div>
							<p className="text-lg font-semibold">
								Welcome, {auth.user?.name || auth.user?.username || 'User'}!
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								Email: {auth.user?.email || 'Not available'}
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								User ID: {auth.user?.id || 'Not available'}
							</p>
						</div>
						<div className="flex gap-4">
							<Link
								href="/dashboard"
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Dashboard
							</Link>
							<Link
								href="/profile"
								className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
							>
								Profile
							</Link>
						</div>
					</div>
				) : (
					<div className="flex justify-between items-center">
						<p className="text-lg">You are not logged in</p>
						<div className="flex gap-4">
							<Link
								href="/login"
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Login
							</Link>
							<Link
								href="/register"
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
							>
								Register
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Original Next.js content */}
			<main className="flex flex-col gap-8 items-center">
				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
					<div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-semibold mb-2">Authentication Examples</h2>
						<ul className="space-y-2">
							<li>
								<Link href="/dashboard" className="text-blue-600 hover:underline">
									→ Protected Dashboard
								</Link>
							</li>
							<li>
								<Link href="/profile" className="text-blue-600 hover:underline">
									→ User Profile
								</Link>
							</li>
							<li>
								<Link href="/settings" className="text-blue-600 hover:underline">
									→ Settings (Client Component)
								</Link>
							</li>
							<li>
								<Link href="/api/user" className="text-blue-600 hover:underline">
									→ API Route Example
								</Link>
							</li>
						</ul>
					</div>

					<div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-semibold mb-2">Session Data</h2>
						<pre className="text-xs overflow-auto p-2 bg-gray-100 dark:bg-gray-900 rounded">
							{JSON.stringify(
								{
									isAuthenticated: auth.isAuthenticated,
									hasToken: auth.hasToken,
									user: auth.user,
								},
								null,
								2
							)}
						</pre>
					</div>

					<div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
						<h2 className="text-xl font-semibold mb-2">Features</h2>
						<ul className="space-y-1 text-sm">
							<li>✓ Server-side authentication</li>
							<li>✓ Protected routes</li>
							<li>✓ User profile fetching</li>
							<li>✓ Session management</li>
							<li>✓ Client component support</li>
							<li>✓ API route protection</li>
						</ul>
					</div>
				</div>
			</main>
		</div>
	);
}