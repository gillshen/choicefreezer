import type { ApplicationStatus } from '$lib/types/applicationTypes';

export function statusToClass(status: ApplicationStatus | ''): string {
	return status.replace(/ /g, '-').toLowerCase();
}

export function getBestScore(scores: Array<{ result: number | null }>): number | null {
	const results = scores
		.map((score) => score.result)
		.filter((result) => result !== null) as number[];

	if (results.length) {
		return Math.max(...results);
	} else {
		return null;
	}
}
