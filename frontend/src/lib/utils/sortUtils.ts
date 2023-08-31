import type { ContractStatus, ServiceRole } from '$lib/types/contractTypes';
import { SERVICE_ROLE_ORDER } from '$lib/constants/cfRoles';

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
