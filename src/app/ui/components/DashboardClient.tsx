// components/DashboardClient.tsx
'use client';
import { fullCityScan, type ScanResponse, type ScanState } from '@/app/actions/scrapper';
import { MapPin, Search, Stethoscope } from 'lucide-react';
import React, { useActionState, useMemo, useState } from 'react';
import Navbar from './Navbar';

const initial: ScanState = { result: null, error: '' };

export default function DashboardClient({ username }: { username: string }) {
	const [doctorType, setDoctorType] = useState('');
	const [cityState, setCityState] = useState('');
	const [open, setOpen] = useState(false);

	const [state, action, pending] = useActionState(fullCityScan, initial);

	const suggestions = useMemo(
		() => [
			'Miami, FL',
			'Orlando, FL',
			'Tampa, FL',
			'Jacksonville, FL',
			'Atlanta, GA',
			'New York, NY',
			'Los Angeles, CA',
			'San Francisco, CA',
			'Chicago, IL',
			'Houston, TX',
		],
		[]
	);
	const filtered = useMemo(() => {
		const q = cityState.trim().toLowerCase();
		if (!q) return suggestions;
		return suggestions.filter((s) => s.toLowerCase().includes(q));
	}, [cityState, suggestions]);

	const rows = useMemo(() => {
		const r = state.result;
		if (!r) return [];
		return (r.sample && r.sample.length ? r.data : r.sample || []) as ScanResponse['data'];
	}, [state.result]);

	// Compute duration (if both timestamps exist)
	const durationSec = useMemo(() => {
		if (!state.result?.started || !state.result?.completed) return null;
		const start = new Date(state.result.started).getTime();
		const end = new Date(state.result.completed).getTime();
		if (Number.isNaN(start) || Number.isNaN(end)) return null;
		return Math.max(0, Math.round((end - start) / 1000));
	}, [state.result]);

	return (
		<div className="min-h-screen">
			<Navbar username={username} />

			<main className="mx-auto max-w-6xl px-6 py-10">
				<header className="mb-8">
					<h1 className="text-2xl font-bold">Welcome back, {username}! 👋</h1>
					<p className="text-sm text-gray-600">Search for health professionals in your city</p>
				</header>

				{/* Generator Card */}
				<section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold">Generate Leads</h2>

					<form action={action} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr,1fr,160px]">
						{state.error ? (
							<div
								role="alert"
								aria-live="polite"
								className="mb-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
							>
								{state.error}
							</div>
						) : null}

						{/* Doctor type */}
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">Type of doctor</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<Stethoscope className="h-5 w-5" />
								</span>
								<input
									name="profession"
									value={doctorType}
									onChange={(e) => setDoctorType(e.target.value)}
									placeholder="e.g. Cardiologist, Dermatologist"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
								/>
							</div>
						</div>

						{/* City, State combobox */}
						<div>
							<label className="mb-1 block text-sm font-medium text-gray-700">City, state</label>
							<div className="relative">
								<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									<MapPin className="h-5 w-5" />
								</span>
								<input
									name="cityState"
									value={cityState}
									onChange={(e) => {
										setCityState(e.target.value);
										setOpen(true);
									}}
									onFocus={() => setOpen(true)}
									onBlur={() => setTimeout(() => setOpen(false), 150)}
									placeholder="e.g. Miami, FL"
									className="h-12 w-full rounded-xl border border-gray-300 pl-11 pr-4 outline-none ring-offset-2 transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
								/>
								{open && filtered.length > 0 && (
									<ul className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 shadow-xl">
										{filtered.map((s) => (
											<li key={s}>
												<button
													type="button"
													onMouseDown={(e) => e.preventDefault()}
													onClick={() => {
														setCityState(s);
														setOpen(false);
													}}
													className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
												>
													{s}
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>

						{/* Submit */}
						<div className="flex items-end">
							<button
								type="submit"
								disabled={pending}
								className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-medium text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:opacity-70"
							>
								<Search className="h-5 w-5" />
								{pending ? 'Generating...' : 'Generate'}
							</button>
						</div>
					</form>
				</section>

				{/* Summary cards */}
				{state.result && (
					<section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
						<StatCard label="Requested" value={state.result.requested} />
						<StatCard label="Processed" value={state.result.processed} />
						<StatCard label="Failed" value={state.result.failed} />
						<StatCard label="Saved to CSV" value={state.result.savedToCsv} />
						<StatCard label="Location" value={state.result.location} />
						<StatCard label="Profession" value={state.result.profession} />
						<StatCard label="Timed Out" value={state.result.timedOut ? 'Yes' : 'No'} />
						<StatCard label="Duration" value={durationSec ? `${durationSec}s` : '—'} />
					</section>
				)}

				{/* Results table + Download */}
				<section className="mt-8">
					{state.result ? (
						rows!.length > 0 ? (
							<div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
								<div className="mb-3 flex items-center justify-between">
									<h3 className="text-base font-semibold">
										{state.result.sample?.length ? 'Sample Results' : 'Results'} ({rows!.length})
									</h3>
									<button
										type="button"
										onClick={() => downloadCsv(rows!, { cityState, profession: doctorType })}
										className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition hover:bg-gray-50"
									>
										Download CSV
									</button>
								</div>
								<table className="min-w-full text-left text-sm">
									<thead className="border-b bg-gray-50 text-gray-700">
										<tr>
											<Th>Name</Th>
											<Th>Phone</Th>
											<Th>Address</Th>
											<Th>Credentials</Th>
											<Th>Title</Th>
											<Th>Position</Th>
											<Th>NPPES</Th>
											<Th>City</Th>
											<Th>Sex</Th>
										</tr>
									</thead>
									<tbody>
										{rows!.map((r, i) => (
											<tr key={i} className="border-b last:border-b-0">
												<Td>{`${r.name_prefix ? r.name_prefix + ' ' : ''}${r.firstName} ${
													r.middleName ? r.middleName + ' ' : ''
												}${r.lastName}`}</Td>
												<Td>{r.phoneNumber || '—'}</Td>
												<Td>{r.address || '—'}</Td>
												<Td>{r.credentials || '—'}</Td>
												<Td>{r.title || '—'}</Td>
												<Td>{r.position || '—'}</Td>
												<Td>{r.nppesNumber ?? '—'}</Td>
												<Td>{r.scrappedCity || '—'}</Td>
												<Td>{r.sex || '—'}</Td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						) : (
							<p className="text-sm text-gray-500">No rows returned.</p>
						)
					) : (
						<p className="text-sm text-gray-500">
							No results yet. Enter a doctor type and city, then hit Generate.
						</p>
					)}
				</section>

				{/* Failures (optional) */}
				{!!state.result?.failures?.length && (
					<section className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
						<h4 className="mb-2 font-semibold">Failures ({state.result.failures.length})</h4>
						<pre className="max-h-64 overflow-auto text-xs">
							{JSON.stringify(state.result.failures, null, 2)}
						</pre>
					</section>
				)}
			</main>
		</div>
	);
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
			<div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
			<div className="mt-1 text-lg font-semibold text-gray-900">{value as any}</div>
		</div>
	);
}

function Th({ children }: { children: React.ReactNode }) {
	return <th className="px-3 py-2 text-xs font-semibold">{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
	return <td className="px-3 py-2 align-top">{children}</td>;
}

/** CSV helpers */
function downloadCsv(
	rows: NonNullable<ScanResponse['data']>,
	meta?: { cityState?: string; profession?: string }
) {
	if (!rows?.length) return;

	const headers = [
		'name_prefix',
		'firstName',
		'middleName',
		'lastName',
		'phoneNumber',
		'address',
		'credentials',
		'title',
		'position',
		'nppesNumber',
		'scrappedCity',
		'sex',
	];

	const lines = [headers.join(',')];
	for (const r of rows) {
		const vals = headers.map((h) => toCsvValue((r as any)[h] ?? ''));
		lines.push(vals.join(','));
	}

	const csv = '\uFEFF' + lines.join('\n'); // BOM so Excel opens as UTF-8
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	const city = (meta?.cityState || '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
	const prof = (meta?.profession || '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
	a.href = url;
	a.download = `leads${prof ? `-${prof}` : ''}${city ? `-${city}` : ''}.csv`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

function toCsvValue(v: any): string {
	if (v === null || v === undefined) return '';
	const s = String(v);
	const needsQuotes = /[",\n]/.test(s);
	const escaped = s.replace(/"/g, '""');
	return needsQuotes ? `"${escaped}"` : escaped;
}
