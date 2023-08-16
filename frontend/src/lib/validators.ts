import { z } from 'zod';
import { MIN_YEAR, THIS_YEAR } from './utils/dateUtils';

export const fieldErrorMessage = { message: 'This field is required' };
export const selectionErrorMessage = { message: 'Select an option' };

// The id field is never directly exposed to user
export const studentIdValidator = { id: z.number() };

export const studentLegalNameValidators = {
	last_name: z.string().trim().min(1, fieldErrorMessage),
	first_name: z.string().trim().min(1, fieldErrorMessage),
	name_in_chinese: z.boolean().default(true)
};

export const studentRomanizedNameValidators = {
	last_name_romanized: z.string().trim().min(1, fieldErrorMessage),
	first_name_romanized: z.string().trim().min(1, fieldErrorMessage)
};

export const studentGenderValidator = { gender: z.string().min(1, selectionErrorMessage) };

export const studentCitizenshipValidator = { citizenship: z.string().min(1).default('China') };

export const studentDateOfBirthValidator = { date_of_birth: z.string().nullable() };

export const studentResidenceValidators = {
	city: z.string().trim().default('').optional(),
	state: z.string().trim().default('').optional()
};

export const studentCommentsValidator = { comments: z.string().trim().default('').optional() };

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
	type: z.string().min(1, selectionErrorMessage),

	target_year: z
		.number()
		.gte(MIN_YEAR, selectionErrorMessage)
		.default(THIS_YEAR + 1),

	date_signed: z.string().nullable(),
	status: z.string().min(1, selectionErrorMessage)
};
