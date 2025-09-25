import { fetchAndUpdateUserProfile } from '@/app/actions/user';
import { checkAuth } from '@/app/lib/auth-helpers';
import { redirect } from 'next/navigation';
import DashboardClient from './ui/components/DashboardClient';

export default async function DashboardPage() {
	const auth = await checkAuth();

	if (auth.isAuthenticated && !auth.user) {
		const result = await fetchAndUpdateUserProfile();
		if ('user' in result) {
			auth.user = result.user;
		}
	}

	if (!auth.isAuthenticated) {
		redirect('/login');
	}

	const username = auth.user?.name || auth.user?.username || 'User';

	return (
		<div className="min-h-screen bg-[#f5f6fb]">
			<DashboardClient username={username} />
		</div>
	);
}
