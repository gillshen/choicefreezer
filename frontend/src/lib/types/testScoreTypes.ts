export type NewToeflScore = {
	student: number;
	date: string | null;
	comments: string;
	reading: number | null;
	listening: number | null;
	speaking: number | null;
	writing: number | null;
};

export type NewIeltsScore = {
	student: number;
	date: string | null;
	comments: string;
	listening: number | null;
	reading: number | null;
	writing: number | null;
	speaking: number | null;
};

export type NewDetScore = {
	student: number;
	date: string | null;
	comments: string;
	overall: number | null;
	literacy: number | null;
	comprehension: number | null;
	conversation: number | null;
	production: number | null;
};

export type NewSatScore = {
	student: number;
	date: string | null;
	comments: string;
	ebrw: number | null;
	math: number | null;
};

export type NewActScore = {
	student: number;
	date: string | null;
	comments: string;
	english: number | null;
	math: number | null;
	reading: number | null;
	science: number | null;
	writing: number | null;
};

export type NewApScore = {
	student: number;
	date: string | null;
	comments: string;
	subject: string;
	score: number | null;
};

export type NewIbGrade = {
	student: number;
	date: string | null;
	comments: string;
	subject: string;
	grade: number | null;
};

export type NewAlevelGrade = {
	student: number;
	date: string | null;
	comments: string;
	subject: string;
	percentage: number | null;
	grade: string | null;
};

export type NewGreScore = {
	student: number;
	date: string | null;
	comments: string;
	verbal: number | null;
	quant: number | null;
	writing: number | null;
};

export type NewGmatScore = {
	student: number;
	date: string | null;
	comments: string;
	total: number | null;
	verbal: number | null;
	quant: number | null;
	reasoning: number | null;
	writing: number | null;
};

export type NewLsatScore = {
	student: number;
	date: string | null;
	comments: string;
	total: number | null;
};
