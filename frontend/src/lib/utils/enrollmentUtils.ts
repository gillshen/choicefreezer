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
