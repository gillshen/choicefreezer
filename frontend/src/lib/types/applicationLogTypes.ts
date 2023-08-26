import type { ApplicationStatus } from '$lib/types/applicationTypes';

export type ApplicationLog = {
	id: number;
	application: number;
	status: ApplicationStatus;
	date: string | null; // date
	comments: string;
	updated: string; // datetime
};

export type NewApplicationLog = Omit<ApplicationLog, 'id' | 'updated'>;
