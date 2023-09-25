export type MajorChoice = {
	id: number;
	application: number;
	major_category: string;
	major: string;
	rank: number;
};

export type NewMajorChoice = Omit<MajorChoice, 'id'>;
