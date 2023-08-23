import type { ApplicationStatus } from '$lib/types/applicationTypes';

export function statusToClass(status: ApplicationStatus | ''): string {
	return status.replace(/ /g, '-').toLowerCase();
}
