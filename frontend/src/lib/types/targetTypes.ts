import type { TERMS } from '$lib/constants/terms';
import type { ProgramType, School } from '$lib/types/programTypes';
import type { SubTarget } from '$lib/types/subTargetTypes';

export type Term = (typeof TERMS)[number];

export type Target = {
	id: number;
	program: number;
	year: number;
	term: Term;
	cf_rank: number | null;
};

export type NewTarget = Omit<Target, 'id' | 'subjective_rank'>;

export type Program = {
	id: number;
	type: ProgramType;
	name: string;
	degree: string;
	schools: number[];
};

export type TargetPageData = {
	id: number;
	schools: School[];
	program: Program;
	program_display_name: string;
	year: number;
	term: Term;
	cf_rank: number | null;
	subtargets: SubTarget[];
};
