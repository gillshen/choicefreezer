import type { ADMISSION_PLANS } from '$lib/constants/admissionPlans';

export type AdmissionPlan = (typeof ADMISSION_PLANS)[number];

export type SubTarget = {
	id: number;
	target: number;
	admission_plan: AdmissionPlan;
	deadline_date: string | null;
	deadline_time: string | null;
	deadline_timezone: string;
	decision_date: string | null;
	comments: string;
};

export type NewSubTarget = Pick<SubTarget, 'target' | 'admission_plan'>;
