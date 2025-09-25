'use client';
import SignupForm from '../ui/new.singup';

export default function RegisterPage() {
	return (
		<SignupForm
			onSubmit={async (data) => {
				console.log('signup data', data);
				alert('Signed up! Check the console for payload.');
			}}
		/>
	);
}
