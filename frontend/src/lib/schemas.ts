import { z } from 'zod';
import {
	applicationValidators,
	contractValidators,
	idValidator,
	studentCitizenshipValidator,
	studentCommentsValidator,
	studentDateOfBirthValidator,
	studentGenderValidator,
	studentLegalNameValidators,
	studentResidenceValidators,
	studentRomanizedNameValidators,
	studentValidators
} from '$lib/validators';

export const newStudentSchema = z.object({
	...studentValidators,
	...contractValidators
});

export const studentLegalNameSchema = z.object({
	...idValidator,
	...studentLegalNameValidators
});

export type StudentLegalNameSchema = typeof studentLegalNameSchema;

export const studentRomanizedNameSchema = z.object({
	...idValidator,
	...studentRomanizedNameValidators
});

export type StudentRomanizedNameSchema = typeof studentRomanizedNameSchema;

export const studentGenderSchema = z.object({
	...idValidator,
	...studentGenderValidator
});

export type StudentGenderSchema = typeof studentGenderSchema;

export const studentCitizenshipSchema = z.object({
	...idValidator,
	...studentCitizenshipValidator
});

export type StudentCitizenshipSchema = typeof studentCitizenshipSchema;

export const studentDateOfBirthSchema = z.object({
	...idValidator,
	...studentDateOfBirthValidator
});

export type StudentDateOfBirthSchema = typeof studentDateOfBirthSchema;

export const studentResidenceSchema = z.object({
	...idValidator,
	...studentResidenceValidators
});

export type StudentResidenceSchema = typeof studentResidenceSchema;

export const studentCommentsSchema = z.object({
	...idValidator,
	...studentCommentsValidator
});

export type StudentCommentsSchema = typeof studentCommentsSchema;

export const contractSchema = z.object({
	studentId: idValidator.id,
	...contractValidators
});

export type ContractSchema = typeof contractSchema;

export const applicationSchema = z.object({
	...applicationValidators
});

export type ApplicationSchema = typeof applicationSchema;
