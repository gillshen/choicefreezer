import { z } from 'zod';
import { THIS_YEAR } from './utils/dateUtils';

export const fieldRequired = { message: 'This field is required' };
export const selectionRequired = { message: 'Select an option' };

// The id field is never directly exposed to user
export const idValidator = { id: z.number().positive() };

export const studentLegalNameValidators = {
	last_name: z.string().trim().min(1, fieldRequired),
	first_name: z.string().trim().min(1, fieldRequired),
	last_name_first: z.boolean().default(true)
};

export const studentRomanizedNameValidators = {
	last_name_romanized: z.string().trim().min(1, fieldRequired),
	first_name_romanized: z.string().trim().min(1, fieldRequired)
};

export const studentGenderValidator = { gender: z.string().min(1, selectionRequired) };

export const studentCitizenshipValidator = { citizenship: z.string().min(1).default('China') };

export const studentDateOfBirthValidator = { date_of_birth: z.string().nullable() };

export const studentResidenceValidators = {
	city: z.string().trim(),
	state: z.string().trim()
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

const nextYear = THIS_YEAR + 1;

export const contractValidators = {
	type: z.string().min(1, selectionRequired),
	target_year: z.number().positive(selectionRequired).default(nextYear),
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
