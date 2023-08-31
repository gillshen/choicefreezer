import type { SCHOOL_TYPES } from '$lib/constants/schoolTypes';
import type { Application } from '$lib/types/gridNestedItemTypes';

export type SchoolType = (typeof SCHOOL_TYPES)[number];

export type School = {
	id: number;
	name: string;
	abbreviation: string;
	type: SchoolType;
	country: string;
};

export type NewSchool = Omit<School, 'id'>;

export type SchoolListItem = {
	id: number;
	name: string;
	abbreviation: string;
	type: SchoolType;
	country: string;
	applications: Application[];
};
