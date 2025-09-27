import { getTokenFromCookies } from '@/app/actions/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: Request) {
	const token = await getTokenFromCookies();
	if (!token) return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });

	const body = await req.text();

	const res = await fetch(`${process.env.NEXT_PUBLIC_NEST_BASE_URL}/scan`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${token}`,
		},
		body,
		// don’t set a client timeout; let platform’s limit apply
	});

	return new Response(await res.text(), {
		status: res.status,
		headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
	});
}
