import type { ContractStatus } from '$lib/types/contractTypes';

export function byName(a: { name: string }, b: { name: string }) {
	return a.name.localeCompare(b.name);
}

export function byCountryName(a: string, b: string) {
	// Put China and the US at the top
	if (a === 'China' || (a === 'United States' && b !== 'China')) {
		return -1;
	}
	if (b === 'China' || (b === 'United States' && a !== 'China')) {
		return 1;
	}
	return a.localeCompare(b);
}

export function byStatusThenTargetYearDesc(
	a: { status: ContractStatus; target_year: number },
	b: { status: ContractStatus; target_year: number }
) {
	if (a.status === b.status) {
		return b.target_year - a.target_year;
	}
	// Effective contracts first
	if (a.status === 'Effective') {
		return -1;
	}
	if (b.status === 'Effective') {
		return 1;
	}
	return b.target_year - a.target_year;
}
