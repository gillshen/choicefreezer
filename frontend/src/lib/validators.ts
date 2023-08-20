import { z } from 'zod';
import { THIS_YEAR } from './utils/dateUtils';

const safeForHtml = (value: string) => !/[<>&"]/.test(value);
const beSafeForHtml = { message: 'Characters <, >, &, and " are not allowed' };

const fieldRequired = { message: 'This field is required' };
const selectionRequired = { message: 'Select an option' };

export const idValidator = { id: z.number().positive() };

// Student & contract creation form
export const studentLegalNameValidators = {
	last_name: z.string().trim().min(1, fieldRequired).refine(safeForHtml, beSafeForHtml),
	first_name: z.string().trim().min(1, fieldRequired).refine(safeForHtml, beSafeForHtml),
	last_name_first: z.boolean().default(true)
};

export const studentRomanizedNameValidators = {
	last_name_romanized: z.string().trim().min(1, fieldRequired).refine(safeForHtml, beSafeForHtml),
	first_name_romanized: z.string().trim().min(1, fieldRequired).refine(safeForHtml, beSafeForHtml)
};

export const studentGenderValidator = { gender: z.string().min(1, selectionRequired) };

export const studentCitizenshipValidator = { citizenship: z.string().min(1).default('China') };

export const studentDateOfBirthValidator = { date_of_birth: z.string().nullable() };

export const studentResidenceValidators = {
	city: z.string().trim().refine(safeForHtml, beSafeForHtml),
	state: z.string().trim().refine(safeForHtml, beSafeForHtml)
};

export const studentCommentsValidator = { comments: z.string().trim() };

export const studentValidators = {
	...studentLegalNameValidators,
	...studentRomanizedNameValidators,
	...studentGenderValidator,
	...studentCitizenshipValidator,
	...studentDateOfBirthValidator,
	...studentResidenceValidators,
	...studentCommentsValidator
};

export const contractValidators = {
	type: z.string().min(1, selectionRequired),
	target_year: z
		.number()
		.positive(selectionRequired)
		.default(THIS_YEAR + 1),
	date_signed: z.string().nullable(),
	student_progression_at_signing: z.string().trim(),
	status: z.string().min(1, selectionRequired),

	// Service fields
	cf_planner: z.number().positive(selectionRequired),
	cf_asst_planner: z.number().nullable(),
	cf_strat_planner: z.number().nullable(),

	cf_essay_advisor_1: z.number().positive(selectionRequired),
	cf_essay_advisor_2: z.number().nullable()
};

// Application creation form
export const applicationValidators = {
	schoolId: z.number().positive(selectionRequired),
	secondSchoolId: z.number().nullable(),
	programType: z.string().min(1, selectionRequired),
	programId: z.number().nullable()
};
