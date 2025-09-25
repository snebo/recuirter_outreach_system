'use client';
import { fullCityScan } from '@/app/actions/scrapper';
import { MapPin, Search, Stethoscope, User as UserIcon } from 'lucide-react';
import React, { useActionState, useMemo, useState } from 'react';
import Navbar from './Navbar';

const initial = { results: [] as string[], error: '' };
export default function DashboardClient({ username }: { username: string }) {
	const [doctorType, setDoctorType] = useState('');
	const [cityState, setCityState] = useState('');
	const [open, setOpen] = useState(false);
	const [results, setResults] = useState<string[]>([]);

	const [state, action, pending] = useActionState(fullCityScan, initial);

	// Example suggestions; swap with real data source/autocomplete later
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
					<form
						// onSubmit={handleGenerate}
						action={action}
						className="grid grid-cols-1 gap-4 md:grid-cols-[1fr,1fr,160px]"
					>
						{state?.error ? (
							<div
								role="alert"
								aria-live="polite"
								className="mb-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
							>
								<p>{state.error}</p>
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
									value={doctorType}
									name="profession"
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
									value={cityState}
									name="cityState"
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

				{/* Results */}
				<section className="mt-8">
					{results.length > 0 ? (
						<div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
							<h3 className="mb-3 text-base font-semibold">Results</h3>
							<ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
								{results.map((r, i) => (
									<li key={i}>{r}</li>
								))}
							</ul>
						</div>
					) : (
						<p className="text-sm text-gray-500">
							No results yet. Enter a doctor type and city, then hit Generate.
						</p>
					)}
				</section>
			</main>
		</div>
	);
}
