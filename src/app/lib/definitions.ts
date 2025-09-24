import * as z from 'zod';

export const signUpFormSchema = z
	.object({
		email: z.email({ message: 'Please enter a valid email.' }).trim().toLowerCase(),
		username: z
			.string()
			.min(4, { message: 'Username must be at least 4 characters.' })
			.trim()
			.toLowerCase()
			.optional(),
		password: z
			.string()
			.min(8, { message: 'Be at least 8 characters long' })
			.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
			.regex(/[0-9]/, { message: 'Contain at least one number.' })
			.regex(/[^a-zA-Z0-9]/, {
				message: 'Contain at least one special character.',
			})
			.trim(),
		confirmPassword: z.string(),
		rememberMe: z.boolean().optional(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const logInFormSchema = z.object({
	email: z.email({ message: 'Please enter a valid email.' }).trim().toLowerCase().optional(),
	username: z.string().trim().toLowerCase().optional(),
	password: z.string().trim(),
});

export type FormState =
	| {
			errors?: {
				username?: string[];
				email?: string[];
				password?: string[];
				confirmPassword?: string[];
				rememberMe?: string[];
				_form?: string[];
			};
			message?: string;
			shouldRedirect?: boolean;
	  }
	| undefined;
