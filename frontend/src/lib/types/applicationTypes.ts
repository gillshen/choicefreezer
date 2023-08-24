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
		deadline: string | null; // datetime
		deadline_timezone: string;
		decision_date: string | null; // datetime
	};

	majors_list: [string];

	latest_log: {
		date: string;
		status: ApplicationStatus;
		updated: string; // datetime
	};

	submitting_toefl: boolean;
	submitting_ielts: boolean;
	submitting_det: boolean;
	submitting_sat: boolean;
	submitting_act: boolean;
	submitting_gre: boolean;
	submitting_gmat: boolean;

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
		status: ApplicationStatus;
		comments: string;
		updated: string; // datetime
	}>;

	submitting_toefl: boolean;
	submitting_ielts: boolean;
	submitting_det: boolean;
	submitting_sat: boolean;
	submitting_act: boolean;
	submitting_gre: boolean;
	submitting_gmat: boolean;

	scholarship_amount: number;
	scholarship_currency: string;
	alt_admitted_into: number;
	latest_status: ApplicationStatus | null;
};
