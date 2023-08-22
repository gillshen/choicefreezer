export type Target = {
	id: number;
	program: number;
	year: number;
	term: string;
	subjective_rank: number | null;
};

export type NewTarget = Omit<Target, 'id' | 'subjective_rank'>;
