import { z } from 'zod';
import {
	applicationValidators,
	contractServiceValidators,
	contractUpdateValidators,
	idValidator,
	studentValidators
} from '$lib/validators';

export const newStudentSchema = z.object({
	...studentValidators,
	...contractServiceValidators
});

export const studentUpdateSchema = z.object({
	...idValidator,
	...studentValidators
});

export type StudentUpdateSchema = typeof studentUpdateSchema;

export const contractUpdateSchema = z.object({
	...contractUpdateValidators
});

export type ContractUpdateSchema = typeof contractUpdateSchema;

export const contractServiceSchema = z.object({
	studentId: idValidator.id,
	...contractServiceValidators
});

export type ContractServiceSchema = typeof contractServiceSchema;

export const applicationSchema = z.object({
	...applicationValidators
});

export type ApplicationSchema = typeof applicationSchema;
