import type { TERMS } from '$lib/constants/terms';
import type { ProgramType, School } from '$lib/types/programTypes';
import type { AdmissionPlan } from './subTargetTypes';

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

export type SubTarget = {
	id: number;
	admission_plan: AdmissionPlan;
	deadline_date: string | null;
	deadline_time: string | null;
	deadline_timezone: string;
	decision_date: string | null;
	comments: string;
	target: number;
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
