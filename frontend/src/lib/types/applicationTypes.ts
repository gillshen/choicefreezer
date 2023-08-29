import type { Gender } from '$lib/types/studentTypes';
import type { ProgramType } from '$lib/types/programTypes';
import type { AdmissionPlan } from '$lib/types/subTargetTypes';
import type { Term } from '$lib/types/targetTypes';
import type { APPLICATION_STATUSES } from '$lib/constants/applicationStatuses';

export type NewApplication = {
	student: number;
	subtarget: number;
};

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type TOEFLScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	reading: number | null;
	listening: number | null;
	speaking: number | null;
	writing: number | null;
	result: number | null;
};

export type IELTSScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	listening: number | null;
	reading: number | null;
	writing: number | null;
	speaking: number | null;
	result: number | null;
};

export type DETScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	overall: number;
	literacy: number | null;
	comprehension: number | null;
	conversation: number | null;
	production: number | null;
	result: number | null;
};

export type SATScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	ebrw: number | null;
	math: number | null;
	result: number | null;
};

export type ACTScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	english: number | null;
	math: number | null;
	reading: number | null;
	science: number | null;
	writing: number | null;
	result: number | null;
};

export type APScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	subject: string;
	score: number | null;
};

export type GREScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	verbal: number | null;
	quant: number | null;
	writing: number | null;
	result: number | null;
};

export type GMATScore = {
	id: number;
	student: number;
	date: string | null; // date
	comments: string;
	verbal: number | null;
	quant: number | null;
	reasoning: number | null;
	writing: number | null;
	total: number | null;
	result: number | null;
};

export type ApplicationListItem = {
	id: number;

	student: {
		id: number;
		name: string;
		gender: Gender;
		citizenship: string;
	};

	cf_people: Array<{
		id: number;
		username: string;
	}>;

	schools: Array<{
		id: number;
		name: string;
		abbreviation: string;
	}>;

	program: {
		id: number;
		type: ProgramType;
		name: string;
		degree: string;
		display_name: string;
	};

	target: {
		id: number;
		year: number;
		term: Term;
		subjective_ranking: number | null;
	};

	subtarget: {
		id: number;
		admission_plan: AdmissionPlan;
		deadline_date: string | null; // date
		deadline_time: string | null; // date
		deadline_timezone: string;
		decision_date: string | null; // datetime
	};

	majors_list: [string];

	latest_log: {
		date: string;
		status: ApplicationStatus;
		updated: string; // datetime
	};

	toefl_submitted: TOEFLScore[];
	ielts_submitted: IELTSScore[];
	det_submitted: DETScore[];
	sat_submitted: SATScore[];
	act_submitted: ACTScore[];
	ap_submitted: APScore[];
	gre_submitted: GREScore[];
	gmat_submitted: GMATScore[];

	scholarship_amount: number;
	scholarship_currency: string;
	alt_admitted_into: number;
};

export type ApplicationPageData = {
	id: number;

	student: {
		id: number;
		name: string;
	};

	schools: Array<{
		id: number;
		name: string;
		abbreviation: string;
	}>;

	program: {
		id: number;
		type: ProgramType;
		name: string;
		degree: string;
		display_name: string;
	};

	target: {
		id: number;
		year: number;
		term: Term;
		subjective_ranking: number | null;
	};

	subtarget: {
		id: number;
		admission_plan: AdmissionPlan;
		deadline_date: string | null; // date
		deadline_time: string | null; // date
		deadline_timezone: string;
		decision_date: string | null; // datetime
	};

	major_choices: Array<{
		id: number;
		application: number;
		major_category: string;
		major: string;
		rank: number;
	}>;

	logs: Array<{
		id: number;
		application: number;
		date: string;
		status: ApplicationStatus;
		comments: string;
		updated: string; // datetime
	}>;

	toefl_submitted: TOEFLScore[];
	ielts_submitted: IELTSScore[];
	det_submitted: DETScore[];
	sat_submitted: SATScore[];
	act_submitted: ACTScore[];
	ap_submitted: APScore[];
	gre_submitted: GREScore[];
	gmat_submitted: GMATScore[];

	scholarship_amount: number;
	scholarship_currency: string;
	alt_admitted_into: number;
	latest_status: ApplicationStatus | null;
};
