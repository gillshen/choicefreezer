import { z } from 'zod';
import {
	applicationLogValidators,
	applicationValidators,
	contractServiceValidators,
	contractUpdateValidators,
	idValidator,
	newSchoolValidators,
	programUpdateValidators,
	studentValidators,
	admissionPlanUpdateValidator,
	majorChoicesUpdateValidator,
	deadlineValidators,
	decisionDateValidators,
	userLogValidators,
	enrollmentValidators,
	serviceValidators,
	toeflValidators
} from '$lib/validators';

export const authenticationSchema = z.object({
	username: z.string().min(1, 'Provide a username'),
	password: z.string().min(1, 'Provide a password')
});

export type AuthenticationSchema = typeof authenticationSchema;

export const userBannersUpdateSchema = z.object({
	username: z.string().min(1),
	public_banner: z.string().max(100, '100 characters max').optional().default(''),
	private_banner: z.string().max(100, '100 characters max').optional().default('')
});

export type UserBannersUpdateSchema = typeof userBannersUpdateSchema;

export const userPasswordResetSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(8, 'Need at least 8 characters')
});

export type UserPasswordResetSchema = typeof userPasswordResetSchema;

export const newSchoolSchema = z.object({ ...newSchoolValidators });

export type NewSchoolSchema = typeof newSchoolSchema;

export const schoolUpdateSchema = z.object({
	...idValidator,
	...newSchoolValidators
});

export type SchoolUpdateSchema = typeof schoolUpdateSchema;

export const programUpdateSchema = z.object({ ...programUpdateValidators });

export type ProgramUpdateSchema = typeof programUpdateSchema;

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

export const contractUpdateSchema = z.object({ ...contractUpdateValidators });

export type ContractUpdateSchema = typeof contractUpdateSchema;

export const contractServiceSchema = z.object({
	studentId: idValidator.id,
	...contractServiceValidators
});

export type ContractServiceSchema = typeof contractServiceSchema;

export const serviceSchema = z.object({ ...serviceValidators });

export type ServiceSchema = typeof serviceSchema;

export const newApplicationSchema = z.object({ ...applicationValidators });

export type NewApplicationSchema = typeof newApplicationSchema;

export const applicationUpdateSchema = z.object({
	...idValidator,
	...admissionPlanUpdateValidator,
	...majorChoicesUpdateValidator
});

export type ApplicationUpdateSchema = typeof applicationUpdateSchema;

export const newApplicationLogSchema = z.object({ ...applicationLogValidators });

export type NewApplicationLogSchema = typeof newApplicationLogSchema;

export const deadlineUpdateSchema = z.object({ ...deadlineValidators });

export type DeadlineUpdateSchema = typeof deadlineUpdateSchema;

export const decisionDateUpdateSchema = z.object({ ...decisionDateValidators });

export type DecisionDateUpdateSchema = typeof decisionDateUpdateSchema;

export const newUserLogSchema = z.object({ ...userLogValidators });

export type NewUserLogSchema = typeof newUserLogSchema;

export const enrollmentSchema = z.object({ ...enrollmentValidators });

export type EnrollmentSchema = typeof enrollmentSchema;

export const toeflSchema = z.object({ ...toeflValidators });

export type ToeflSchema = typeof toeflSchema;
