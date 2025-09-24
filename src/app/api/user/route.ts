import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/sessions';

/**
 * Protected API Route Example
 * GET /api/user - Returns current user data
 */
export async function GET() {
	try {
		const session = await getSession(await cookies());

		// Check if user is authenticated
		if (!session.isLoggedIn || !session.accessToken) {
			return NextResponse.json(
				{ error: 'Unauthorized', message: 'Please login to access this resource' },
				{ status: 401 }
			);
		}

		// Return user data from session
		return NextResponse.json({
			success: true,
			user: session.user || null,
			hasToken: !!session.accessToken,
			message: 'This is a protected API route',
		});
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}

/**
 * Example of using the access token to make backend API calls
 * POST /api/user - Update user data (example)
 */
export async function POST(request: Request) {
	try {
		const session = await getSession(await cookies());

		// Check authentication
		if (!session.isLoggedIn || !session.accessToken) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Get request body
		const body = await request.json();

		// Example: Make a request to your backend using the access token
		// const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_NEST_BASE_URL}/user/update`, {
		//     method: 'POST',
		//     headers: {
		//         'Authorization': `Bearer ${session.accessToken}`,
		//         'Content-Type': 'application/json',
		//     },
		//     body: JSON.stringify(body),
		// });

		// For demo purposes, just return the received data
		return NextResponse.json({
			success: true,
			message: 'Data received (demo)',
			receivedData: body,
			user: session.user,
		});
	} catch (error) {
		console.error('API Error:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}