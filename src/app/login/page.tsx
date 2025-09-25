'use client';
import MaterioLogin from '../ui/components/new.login';

export default function LoginPage() {
	return (
		<MaterioLogin
			imageUrl="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2070&auto=format&fit=crop"
			onSubmit={(data) => console.log('submit', data)}
		/>
	);
}
