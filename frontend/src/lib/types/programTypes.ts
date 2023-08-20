import type { PROGRAM_TYPES } from '$lib/constants/programTypes';

export type ProgramType = (typeof PROGRAM_TYPES)[number];

export type Program = {
	id: number;
	type: ProgramType;
	name: string;
	degree: string;
	schools: number[];
};

export type ProgramSelectItem = {
	id: number;
	type: ProgramType;
	display_name: string;
	schools: number[];
};
