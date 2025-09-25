'use server';
const NEST_BASE_URL = process.env.NEXT_PUBLIC_NEST_BASE_URL;

export async function fullCityScan(
	prevState: { results: string[]; error: string },
	formData: FormData
) {
	const profession = (formData.get('profession') || '').toString().trim();
	const cityState = (formData.get('cityState') || '').toString().trim();

	if (!profession || !cityState) {
		return { results: [], error: 'Profession and City/State are required.' };
	}

	try {
		const res = await fetch(`${NEST_BASE_URL}/puppet/fullscan`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ profession, cityState, concurrency: 5, timeoutMs: 150000 }),
		});

		if (!res.ok) {
			return { results: [], error: 'Something went wrong while scrapping' };
		}

		const data = await res.json();
		const results = Array.isArray(data)
			? data.map((d: any) => (typeof d === 'string' ? d : JSON.stringify(d)))
			: [typeof data === 'string' ? data : JSON.stringify(data)];

		return { results, error: '' };
	} catch (e: any) {
		return { results: [], error: `Server error: ${e?.message || e}` };
	}
}
