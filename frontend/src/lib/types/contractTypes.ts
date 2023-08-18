export type Service = {
	id: number;
	contract: number;
	cf_person: number;
	cf_username: string;
	role: string;
	start_date: string | null;
	end_date: string | null;
};

export type Contract = {
	id: number;
	student: number;
	type: string;
	target_year: number;
	date_signed: string | null;
	student_progression_at_signing: string;
	status: 'Effective' | 'Fulfilled' | 'Terminated';
	services: Service[];
};
