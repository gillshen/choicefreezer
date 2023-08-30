import type { ProgramType } from './programTypes';
import type { AdmissionPlan } from './subTargetTypes';
import type { Term } from './targetTypes';

export type Application = {
	id: number;
	program_type: ProgramType;
	year: number;
	term: Term;
	admission_plan: AdmissionPlan;
	general_status: 'in progress' | 'result pending' | 'final';
	was_submitted: boolean;
	was_admitted: boolean;
	was_rejected: boolean;
	was_deferred: boolean;
	was_waitlisted: boolean;
};
