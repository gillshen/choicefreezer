import type { ContractStatus } from '$lib/types/contractTypes';

export function toUsernamesWithRole(
	services: { role: string; cf_username: string }[],
	role: string
): string {
	return joinSortedNames(services.filter((s) => s.role === role));
}

export function joinSortedNames(
	services: { cf_username: string }[],
	joinWith: string = ', '
): string {
	return services
		.map((s) => s.cf_username)
		.sort()
		.join(joinWith);
}

export function formatEndDate(
	serviceEndDate: string | null,
	contractStatus: ContractStatus
): string {
	if (serviceEndDate) {
		return serviceEndDate;
	}
	if (contractStatus === 'Effective') {
		return 'present';
	}
	return 'End of contract';
}
