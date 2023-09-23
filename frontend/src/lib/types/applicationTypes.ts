import type { Gender } from '$lib/types/studentTypes';
import type { ProgramType } from '$lib/types/programTypes';
import type { AdmissionPlan } from '$lib/types/subTargetTypes';
import type { Term } from '$lib/types/targetTypes';
import type { APPLICATION_STATUSES } from '$lib/constants/applicationStatuses';
import type {
	ToeflScore,
	IeltsScore,
	DetScore,
	SatScore,
	ActScore,
	ApScore,
	IbGrade,
	AlevelGrade,
	GmatScore,
	GreScore,
	LsatScore
} from '$lib/types/testScoreTypes';

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

	toefl_submitted: ToeflScore[];
	ielts_submitted: IeltsScore[];
	det_submitted: DetScore[];
	sat_submitted: SatScore[];
	act_submitted: ActScore[];
	ap_submitted: ApScore[];
	ib_predicted_submitted: IbGrade[];
	ib_final_submitted: IbGrade[];
	alevel_predicted_submitted: AlevelGrade[];
	alevel_final_submitted: AlevelGrade[];
	gre_submitted: GreScore[];
	gmat_submitted: GmatScore[];
	lsat_submitted: LsatScore[];

	scholarship_amount: number;
	scholarship_currency: string;
	alt_admitted_into: {
		id: number;
		program_display_name: string;
	};
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

	toefl_submitted: ToeflScore[];
	ielts_submitted: IeltsScore[];
	det_submitted: DetScore[];
	sat_submitted: SatScore[];
	act_submitted: ActScore[];
	ap_submitted: ApScore[];
	ib_predicted_submitted: IbGrade[];
	ib_final_submitted: IbGrade[];
	alevel_predicted_submitted: AlevelGrade[];
	alevel_final_submitted: AlevelGrade[];
	gre_submitted: GreScore[];
	gmat_submitted: GmatScore[];
	lsat_submitted: LsatScore[];

	scholarship_amount: number;
	scholarship_currency: string;
	alt_admitted_into: {
		id: number;
		program_display_name: string;
	};
	latest_status: ApplicationStatus | null;
};
