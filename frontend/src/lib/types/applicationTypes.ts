import type { Gender } from '$lib/types/studentTypes';
import type { ProgramType } from '$lib/types/programTypes';
import type { AdmissionPlan } from '$lib/types/subTargetTypes';
import type { Term } from '$lib/types/targetTypes';

export type NewApplication = {
	student: number;
	subtarget: number;
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
		deadline: string | null; // datetime
		deadline_timezone: string;
		decision_date: string | null; // datetime
	};

	majors_list: [string];

	latest_log: {
		date: string;
		status: string; // TODO
		updated: string; // datetime
	};

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
		deadline: string | null; // datetime
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
		status: string; // TODO
		comments: string;
		updated: string; // datetime
	}>;

	scholarship_amount: number;
	scholarship_currency: string;
	alt_admitted_into: number;
	latest_status: string | null;
};
