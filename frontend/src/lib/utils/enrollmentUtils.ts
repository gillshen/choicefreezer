export function abbreviateProgression(progression: string): string {
	const matchGrade = progression.match(/\bG\d+\b/);
	if (matchGrade) {
		return matchGrade[0];
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

	const matchMasterYear = progression.match(/(?<=\bMaster Year )\d+\b/);
	if (matchMasterYear) {
		return `M${matchMasterYear[0]}`;
	}

	return progression;
}
