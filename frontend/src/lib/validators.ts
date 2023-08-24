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

const contractValidators = {
	type: z.string().min(1, selectionRequired),
	target_year: z
		.number()
		.positive(selectionRequired)
		.default(THIS_YEAR + 1),
	date_signed: z.string().nullable(),
	student_progression_at_signing: z.string().trim(),
	status: z.string().min(1, selectionRequired)
};

export const contractUpdateValidators = {
	...idValidator,
	...contractValidators
};

export const contractServiceValidators = {
	...contractValidators,

	// Service fields
	cf_planner: z.number().positive(selectionRequired),
	cf_asst_planner: z.number().nullable(),
	cf_strat_planner: z.number().nullable(),

	cf_essay_advisor_1: z.number().positive(selectionRequired),
	cf_essay_advisor_2: z.number().nullable()
};

// Application creation form
export const applicationValidators = {
	studentId: idValidator.id,

	schoolId: z.number().positive(selectionRequired),

	/* The second school id is required for a joint program but
	 * optional otherwise. Forms should set it to a negative value
	 * by default when it is required, and default to 0 if not. */
	secondSchoolId: z.number().nonnegative(selectionRequired),

	programType: z.string().min(1, selectionRequired),

	/* The program id is not required when the user explicitly
	 * indicates that they want a new program created, which forms
	 * should represent by setting the value to 0. The default value
	 * should be negative to trigger the validation error. */
	programId: z.number().nonnegative(selectionRequired),

	programName: z.string().trim().default(''),
	programDegree: z.string().trim().default(''),

	year: z
		.number()
		.positive(selectionRequired)
		.default(THIS_YEAR + 1),
	term: z.string().min(1, selectionRequired),
	admissionPlan: z.string().min(1, selectionRequired),

	firstMajorCategory: z.string().trim().optional().default(''),
	firstMajor: z.string().trim().nullable(),
	secondMajorCategory: z.string().trim().optional().default(''),
	secondMajor: z.string().trim().nullable(),
	thirdMajorCategory: z.string().trim().optional().default(''),
	thirdMajor: z.string().trim().nullable()
};
