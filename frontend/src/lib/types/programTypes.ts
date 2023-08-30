import type { PROGRAM_TYPES } from '$lib/constants/programTypes';
import type { Application } from '$lib/types/gridNestedItemTypes';
import type { Term } from '$lib/types/targetTypes';

export type ProgramType = (typeof PROGRAM_TYPES)[number];

export type Program = {
	id: number;
	type: ProgramType;
	name: string;
	degree: string;
	schools: number[];
};

export type NewProgram = Omit<Program, 'id'>;

export type School = {
	id: number;
	name: string;
	abbreviation: string;
};

export type Target = {
	id: number;
	year: number;
	term: Term;
};

export type ProgramListItem = {
	id: number;
	type: ProgramType;
	display_name: string;
	schools: School[];
	targets: Target[];
	applications: Application[];
};

export type ProgramSelectItem = {
	id: number;
	type: ProgramType;
	display_name: string;
	schools: number[];
};
