import type { SCHOOL_TYPES } from '$lib/constants/schoolTypes';

export type SchoolType = (typeof SCHOOL_TYPES)[number];

export type School = {
	id: number;
	name: string;
	abbreviation: string;
	type: SchoolType;
	country: string;
};
