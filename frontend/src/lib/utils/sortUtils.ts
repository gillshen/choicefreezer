import type { ContractStatus, ServiceRole } from '$lib/types/contractTypes';
import { SERVICE_ROLE_ORDER } from '$lib/constants/cfRoles';
import type { TermOrYear } from '$lib/types/enrollmentTypes';

export function byName(a: { name: string }, b: { name: string }) {
	return a.name.localeCompare(b.name);
}

export function byType(a: { type: string }, b: { type: string }) {
	return a.type.localeCompare(b.type);
}

export function byYearDesc(a: { year: number }, b: { year: number }) {
	return b.year - a.year;
}

export function byTargetYearDesc(a: { target_year: number }, b: { target_year: number }) {
	return b.target_year - a.target_year;
}

export function byNameChinaFirst(a: string, b: string) {
	// Put China first, then the US, then the rest
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

export function byServiceRoleThenUsername(
	a: { cf_username: string; role: ServiceRole },
	b: { cf_username: string; role: ServiceRole }
) {
	if (a.role === b.role) {
		return a.cf_username.localeCompare(b.cf_username);
	}
	return SERVICE_ROLE_ORDER[a.role] - SERVICE_ROLE_ORDER[b.role];
}

function compareDateStringDesc(a: string | null, b: string | null) {
	if (a === null && b === null) {
		return 0;
	}
	if (a === null) {
		return 1;
	}
	if (b === null) {
		return -1;
	}
	return b.localeCompare(a);
}

export function byEndDateStartDateDesc(
	a: { start_date: string | null; end_date: string | null },
	b: { start_date: string | null; end_date: string | null }
) {
	return (
		compareDateStringDesc(a.end_date, b.end_date) ||
		compareDateStringDesc(a.start_date, b.start_date)
	);
}

export function byTermDescCumulativeFirst(
	a: { term: TermOrYear; is_cumulative?: boolean },
	b: { term: TermOrYear; is_cumulative?: boolean }
) {
	// If terms are identical, cumulative first
	if (a.term === b.term) {
		if (a.is_cumulative) {
			return -1;
		} else if (b.is_cumulative) {
			return 1;
		}
		return 0;
	}
	// Else sort by term
	const termOrdering: Record<TermOrYear, number> = {
		'Academic Year': 0,
		Summer: 1,
		'Spring-Summer': 2,
		Spring: 3,
		Winter: 4,
		Fall: 5
	};
	return termOrdering[a.term] - termOrdering[b.term];
}
