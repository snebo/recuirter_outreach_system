// app/actions/scrapper.ts
'use server';
import 'server-only';

const NEST_BASE_URL = process.env.NEXT_PUBLIC_NEST_BASE_URL as string;

export type ScanRow = {
	firstName: string;
	lastName: string;
	middleName: string;
	name_prefix: string;
	scrappedCity: string;
	nppesNumber: number | null;
	phoneNumber: string;
	address: string;
	credentials: string;
	sex: '' | 'male' | 'female';
	title: string;
	position: string;
};

export type ScanResponse = {
	location: string;
	profession: string;
	requested: number;
	processed: number;
	started: string; // ISO strings are safest to serialize
	completed: string; // ISO strings are safest to serialize
	savedToCsv: number;
	failed: number;
	timedOut: boolean;
	sample?: ScanRow[]; // optional
	data?: ScanRow[]; // optional
	failures?: any[]; // shape unknown per your note
};

export type ScanState = {
	result: ScanResponse | null;
	error: string;
};

export async function fullCityScan(prevState: ScanState, formData: FormData): Promise<ScanState> {
	const profession = (formData.get('profession') || '').toString().trim();
	const cityState = (formData.get('cityState') || '').toString().trim();

	if (!profession || !cityState) {
		return { result: null, error: 'Profession and City/State are required.' };
	}

	try {
		const res = await fetch(`${NEST_BASE_URL}/puppet/fullscan`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ profession, cityState, concurrency: 5, timeoutMs: 150000 }),
			// Optionally: next: { revalidate: 0 } // if needed
		});

		if (!res.ok) {
			return { result: null, error: 'Something went wrong while scrapping' };
		}

		const data = (await res.json()) as ScanResponse;

		// Ensure dates are strings (in case backend returns Date objects)
		const started =
			typeof data.started === 'string' ? data.started : new Date(data.started).toISOString();
		const completed =
			typeof data.completed === 'string' ? data.completed : new Date(data.completed).toISOString();

		return { result: { ...data, started, completed }, error: '' };
	} catch (e: any) {
		return { result: null, error: `Server error: ${e?.message || e}` };
	}
}
