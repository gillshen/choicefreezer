import type { TERMS } from '$lib/constants/terms';

export type Term = (typeof TERMS)[number];

export type Target = {
	id: number;
	program: number;
	year: number;
	term: Term;
	subjective_rank: number | null;
};

export type NewTarget = Omit<Target, 'id' | 'subjective_rank'>;
