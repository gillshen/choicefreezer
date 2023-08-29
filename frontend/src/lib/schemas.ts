import { z } from 'zod';
import {
	applicationLogValidators,
	applicationValidators,
	contractServiceValidators,
	contractUpdateValidators,
	idValidator,
	studentValidators,
	admissionPlanUpdateValidator,
	majorChoicesUpdateValidator,
	deadlineValidators,
	decisionDateValidators
} from '$lib/validators';

export const newStudentSchema = z.object({
	...studentValidators,
	...contractServiceValidators
});

export type NewStudentSchema = typeof newStudentSchema;

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

export const newApplicationSchema = z.object({
	...applicationValidators
});

export type NewApplicationSchema = typeof newApplicationSchema;

export const applicationUpdateSchema = z.object({
	...idValidator,
	...admissionPlanUpdateValidator,
	...majorChoicesUpdateValidator
});

export type ApplicationUpdateSchema = typeof applicationUpdateSchema;

export const newApplicationLogSchema = z.object({
	...applicationLogValidators
});

export type NewApplicationLogSchema = typeof newApplicationLogSchema;

export const deadlineUpdateSchema = z.object({
	...deadlineValidators
});

export type DeadlineUpdateSchema = typeof deadlineUpdateSchema;

export const decisionDateUpdateSchema = z.object({
	...decisionDateValidators
});

export type DecisionDateUpdateSchema = typeof decisionDateUpdateSchema;
