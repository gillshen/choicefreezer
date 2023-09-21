export const HIGH_SCHOOL_PROGRESSIONS = [
	'High School G9',
	'High School G10',
	'High School G11',
	'High School G12'
] as const;

export const UG_PROGRESSIONS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Year 5'] as const;

export const MASTER_PROGRESSIONS = ['Master Year 1', 'Master Year 2'];

export const ALL_PROGRESSIONS = [
	...HIGH_SCHOOL_PROGRESSIONS,
	...UG_PROGRESSIONS,
	...MASTER_PROGRESSIONS
] as const;
