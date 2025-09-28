// app/api/scan/[jobId]/route.ts
import { getTokenFromCookies } from '@/app/actions/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = { jobId: string };

export async function GET(_req: Request, ctx: { params: Params } | { params: Promise<Params> }) {
	// ✅ Handle both sync and async params (compat with different Next versions)
	const p = (ctx.params as any)?.then
		? await (ctx.params as Promise<Params>)
		: (ctx.params as Params);
	const jobId = p.jobId;

	const token = await getTokenFromCookies();
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthenticated' }), { status: 401 });
	}

	const nest = process.env.NEXT_PUBLIC_NEST_BASE_URL!;
	const res = await fetch(`${nest}/scan/${encodeURIComponent(jobId)}`, {
		method: 'GET',
		headers: { authorization: `Bearer ${token}` },
		cache: 'no-store',
	});

	return new Response(await res.text(), {
		status: res.status,
		headers: { 'content-type': res.headers.get('content-type') || 'application/json' },
	});
}
