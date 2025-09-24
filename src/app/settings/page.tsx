'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '../actions/user';

/**
 * Settings Page - Client Component Example
 * Shows how to use server actions in client components
 */
export default function SettingsPage() {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [testResult, setTestResult] = useState<any>(null);

	useEffect(() => {
		// Fetch user data on mount
		getCurrentUser()
			.then((userData) => {
				setUser(userData);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Failed to fetch user:', error);
				setLoading(false);
			});
	}, []);

	// Test API call from client
	const testAPICall = async () => {
		try {
			const response = await fetch('/api/user');
			const data = await response.json();
			setTestResult(data);
		} catch (error) {
			setTestResult({ error: 'Failed to call API' });
		}
	};

	// Test POST to API
	const testPostAPI = async () => {
		try {
			const response = await fetch('/api/user', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					testData: 'Hello from client component',
					timestamp: new Date().toISOString(),
				}),
			});
			const data = await response.json();
			setTestResult(data);
		} catch (error) {
			setTestResult({ error: 'Failed to POST to API' });
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen p-8 flex items-center justify-center">
				<div className="text-lg">Loading settings...</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="min-h-screen p-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-4">Settings</h1>
					<div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
						<p className="text-yellow-800 dark:text-yellow-200">
							You need to be logged in to access settings.
						</p>
						<Link href="/login" className="text-blue-600 hover:underline mt-2 inline-block">
							Go to Login →
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">Settings</h1>
					<p className="text-gray-600 dark:text-gray-400">
						This is a client component that fetches user data using server actions
					</p>
				</div>

				{/* User Info from Client */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">
						User Data (Fetched from Client Component)
					</h2>
					<div className="space-y-2">
						<div>
							<span className="font-medium">Name:</span> {user?.name || 'N/A'}
						</div>
						<div>
							<span className="font-medium">Email:</span> {user?.email || 'N/A'}
						</div>
						<div>
							<span className="font-medium">Username:</span> {user?.username || 'N/A'}
						</div>
						<div>
							<span className="font-medium">ID:</span> {user?.id || 'N/A'}
						</div>
					</div>
				</div>

				{/* API Test Section */}
				<div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">Test API Routes</h2>
					<div className="space-y-4">
						<p className="text-sm text-gray-600 dark:text-gray-400">
							Test protected API endpoints from this client component:
						</p>
						<div className="flex gap-4">
							<button
								onClick={testAPICall}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Test GET /api/user
							</button>
							<button
								onClick={testPostAPI}
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
							>
								Test POST /api/user
							</button>
						</div>

						{testResult && (
							<div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded">
								<h3 className="font-medium mb-2">API Response:</h3>
								<pre className="text-xs overflow-auto">{JSON.stringify(testResult, null, 2)}</pre>
							</div>
						)}
					</div>
				</div>

				{/* Settings Form (Example) */}
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">Preferences (Demo)</h2>
					<form className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">
								Email Notifications
							</label>
							<input
								type="checkbox"
								className="mr-2"
								defaultChecked
							/>
							<span>Receive email updates</span>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Display Name
							</label>
							<input
								type="text"
								className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600"
								defaultValue={user?.name || ''}
								placeholder="Enter display name"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">
								Theme
							</label>
							<select className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600">
								<option>System</option>
								<option>Light</option>
								<option>Dark</option>
							</select>
						</div>

						<button
							type="button"
							onClick={() => alert('Settings saved (demo only)')}
							className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
						>
							Save Settings
						</button>
					</form>
				</div>

				{/* Client Component Info */}
				<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
					<h3 className="font-semibold mb-2">ℹ️ About This Page</h3>
					<ul className="text-sm space-y-1">
						<li>• This is a client component ('use client')</li>
						<li>• It fetches user data using the getCurrentUser server action</li>
						<li>• It can make direct API calls using fetch()</li>
						<li>• State management is handled with React hooks</li>
						<li>• Perfect for interactive features and real-time updates</li>
					</ul>
				</div>

				{/* Navigation */}
				<div className="flex gap-4">
					<Link
						href="/"
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
					>
						← Back to Home
					</Link>
					<Link
						href="/dashboard"
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Dashboard
					</Link>
					<Link
						href="/profile"
						className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
					>
						Profile
					</Link>
				</div>
			</div>
		</div>
	);
}