import type { ProgramType } from './programTypes';
import type { ALL_PROGRESSIONS } from '$lib/constants/progressions';
import type { CURRICULA } from '$lib/constants/curricula';

export type Progression = (typeof ALL_PROGRESSIONS)[number];
export type Curriculum = (typeof CURRICULA)[number];

export type Enrollment = {
	id: number;
	student: number;
	school: number;

	program_type: ProgramType;
	starting_progression: Progression;

	start_date: string; // date
	end_date: string | null; // date

	curriculum: Curriculum;
	majors: string;
};

export type NewEnrollment = Omit<Enrollment, 'id'>;
