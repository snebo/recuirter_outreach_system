import SignUpForm from '../ui/sign.up.form';

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="max-w-md w-full space-y-8 p-8">
				<h1 className="text-3xl font-bold text-center">Register</h1>
				<SignUpForm />
			</div>
		</div>
	);
}