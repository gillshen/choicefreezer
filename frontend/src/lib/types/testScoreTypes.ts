export type ToeflScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	reading: number | null;
	listening: number | null;
	speaking: number | null;
	writing: number | null;
	result: number | null;
};

export type NewToeflScore = Omit<ToeflScore, 'id' | 'result'>;

export type IeltsScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	listening: number | null;
	reading: number | null;
	writing: number | null;
	speaking: number | null;
	result: number | null;
};

export type NewIeltsScore = Omit<IeltsScore, 'id' | 'result'>;

export type DetScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	overall: number | null;
	literacy: number | null;
	comprehension: number | null;
	conversation: number | null;
	production: number | null;
	result: number | null;
};

export type NewDetScore = Omit<DetScore, 'id' | 'result'>;

export type SatScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	ebrw: number | null;
	math: number | null;
	result: number | null;
};

export type NewSatScore = Omit<SatScore, 'id' | 'result'>;

export type ActScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	english: number | null;
	math: number | null;
	reading: number | null;
	science: number | null;
	writing: number | null;
	result: number | null;
};

export type NewActScore = Omit<ActScore, 'id' | 'result'>;

export type ApScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	subject: string;
	score: number | null;
};

export type NewApScore = Omit<ApScore, 'id'>;

export type IbGrade = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	subject: string;
	grade: number | null;
};

export type NewIbGrade = Omit<IbGrade, 'id'>;

export type AlevelGrade = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	subject: string;
	percentage: number | null;
	grade: string | null;
};

export type NewAlevelGrade = Omit<AlevelGrade, 'id'>;

export type GreScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	verbal: number | null;
	quant: number | null;
	writing: number | null;
	result: number | null;
};

export type NewGreScore = Omit<GreScore, 'id' | 'result'>;

export type GmatScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	total: number | null;
	verbal: number | null;
	quant: number | null;
	reasoning: number | null;
	writing: number | null;
	result: number | null;
};

export type NewGmatScore = Omit<GmatScore, 'id' | 'result'>;

export type LsatScore = {
	id: number;
	student: number;
	date: string | null;
	comments: string;
	total: number | null;
	result: number | null;
};

export type NewLsatScore = Omit<LsatScore, 'id' | 'result'>;
