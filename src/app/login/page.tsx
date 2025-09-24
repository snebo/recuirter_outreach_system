import LoginForm from '../ui/login.form';

export default function LoginPage() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="max-w-md w-full space-y-8 p-8">
				<h1 className="text-3xl font-bold text-center">Login</h1>
				<LoginForm />
			</div>
		</div>
	);
}