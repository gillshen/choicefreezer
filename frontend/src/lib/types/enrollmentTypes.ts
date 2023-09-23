import type { ProgramType } from '$lib/types/programTypes';
import type { Term } from '$lib/types/targetTypes';
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

	curriculum: Curriculum | '';
	majors: string;
};

export type NewEnrollment = Omit<Enrollment, 'id'>;

export type TermOrYear = Term | 'Academic Year';

export type Gpa = {
	id: number;
	enrollment: number;
	progression: Progression;
	term: TermOrYear;
	value: number;
	scale: number;
	is_cumulative: boolean;
};

export type NewGpa = Omit<Gpa, 'id'>;

export type ClassRank = {
	id: number;
	enrollment: number;
	progression: Progression;
	term: TermOrYear;
	class_size: number | null;
	rank: number | null;
	top_x: number | null;
};

export type NewClassRank = Omit<Gpa, 'id'>;

export type EnrollmentListItem = {
	id: number;
	student: number;
	school: {
		id: number;
		name: string;
	};

	program_type: ProgramType;
	start_date: string; // date
	starting_progression: Progression;
	end_date: string | null; // date
	ending_progression: Progression | '';

	curriculum: Curriculum | '';
	majors: string;

	grades: Gpa[];
	class_ranks: ClassRank[];
};

export type EnrollmentPageData = {
	id: number;
	student: {
		id: number;
		name: string;
	};
	school: {
		id: number;
		name: string;
	};

	program_type: ProgramType;
	start_date: string; // date
	starting_progression: Progression;
	end_date: string | null; // date
	ending_progression: Progression | '';

	curriculum: Curriculum | '';
	majors: string;

	grades: Gpa[];
	class_ranks: ClassRank[];
};
