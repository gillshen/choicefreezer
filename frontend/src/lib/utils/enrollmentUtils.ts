import { ALL_PROGRESSIONS } from '$lib/constants/progressions';
import type { ClassRank, Gpa, Progression } from '$lib/types/enrollmentTypes';

export function formatProgression(progression: string): string {
	const matchHighSchool = progression.match(/\bG\d+\b/);
	if (matchHighSchool) {
		return matchHighSchool[0];
	}
	return progression;
}

export function abbreviateProgression(progression: string): string {
	const matchHighSchool = progression.match(/\bG\d+\b/);
	if (matchHighSchool) {
		return matchHighSchool[0];
	}

	switch (progression) {
		case 'Freshman':
			return 'Fr.';
		case 'Sophomore':
			return 'So.';
		case 'Junior':
			return 'Jr.';
		case 'Senior':
			return 'Sr.';
	}

	const matchMaster = progression.match(/(?<=\bMaster Year )\d+\b/);
	if (matchMaster) {
		return `M${matchMaster[0]}`;
	}

	return progression;
}

export function formatTermType(gpa: Gpa) {
	if (gpa.is_cumulative) {
		return 'Cumul.';
	}
	if (gpa.term === 'Academic Year') {
		return 'Year';
	}
	return 'Term';
}

export function groupByProgressionDesc<T extends Gpa | ClassRank>(
	data: T[]
): Record<Progression, T[]> {
	const grouped: Record<Progression, T[]> = {};
	const progressions = Array.from(ALL_PROGRESSIONS).reverse();

	for (const progression of progressions) {
		const match = data.filter((item) => item.progression === progression);
		if (match.length) {
			grouped[progression] = match;
		}
	}

	return grouped;
}
