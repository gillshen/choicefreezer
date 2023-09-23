import { z } from 'zod';
import {
	idValidator,
	contractUpdateValidators,
	contractServiceValidators,
	serviceValidators,
	applicationValidators,
	applicationLogValidators,
	newSchoolValidators,
	programUpdateValidators,
	studentValidators,
	admissionPlanUpdateValidator,
	majorChoicesUpdateValidator,
	deadlineValidators,
	decisionDateValidators,
	userLogValidators,
	enrollmentValidators,
	gpaValidators,
	classRankValidators,
	toeflScoreValidators,
	ieltsScoreValidators,
	detScoreValidators,
	satScoreValidators,
	actScoreValidators,
	apScoreValidators,
	ibGradeValidators,
	alevelGradeValidators,
	greScoreValidators,
	gmatScoreValidators,
	lsatScoreValidators
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

export const newSchoolSchema = z.object(newSchoolValidators);

export type NewSchoolSchema = typeof newSchoolSchema;

export const schoolUpdateSchema = z.object({
	...idValidator,
	...newSchoolValidators
});

export type SchoolUpdateSchema = typeof schoolUpdateSchema;

export const programUpdateSchema = z.object(programUpdateValidators);

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

export const contractUpdateSchema = z.object(contractUpdateValidators);

export type ContractUpdateSchema = typeof contractUpdateSchema;

export const contractServiceSchema = z.object({
	studentId: idValidator.id,
	...contractServiceValidators
});

export type ContractServiceSchema = typeof contractServiceSchema;

export const serviceSchema = z.object(serviceValidators);

export type ServiceSchema = typeof serviceSchema;

export const newApplicationSchema = z.object(applicationValidators);

export type NewApplicationSchema = typeof newApplicationSchema;

export const applicationUpdateSchema = z.object({
	...idValidator,
	...admissionPlanUpdateValidator,
	...majorChoicesUpdateValidator
});

export type ApplicationUpdateSchema = typeof applicationUpdateSchema;

export const newApplicationLogSchema = z.object(applicationLogValidators);

export type NewApplicationLogSchema = typeof newApplicationLogSchema;

export const deadlineUpdateSchema = z.object(deadlineValidators);

export type DeadlineUpdateSchema = typeof deadlineUpdateSchema;

export const decisionDateUpdateSchema = z.object(decisionDateValidators);

export type DecisionDateUpdateSchema = typeof decisionDateUpdateSchema;

export const newUserLogSchema = z.object(userLogValidators);

export type NewUserLogSchema = typeof newUserLogSchema;

export const enrollmentSchema = z.object(enrollmentValidators);

export type EnrollmentSchema = typeof enrollmentSchema;

export const gpaSchema = z.object(gpaValidators);

export type GpaSchema = typeof gpaSchema;

export const classRankSchema = z.object(classRankValidators);

export type ClassRankSchema = typeof classRankSchema;

export const toeflScoreSchema = z.object(toeflScoreValidators);

export type ToeflScoreSchema = typeof toeflScoreSchema;

export const ieltsScoreSchema = z.object(ieltsScoreValidators);

export type IeltsScoreSchema = typeof ieltsScoreSchema;

export const detScoreSchema = z.object(detScoreValidators);

export type DetScoreSchema = typeof detScoreSchema;

export const satScoreSchema = z.object(satScoreValidators);

export type SatScoreSchema = typeof satScoreSchema;

export const actScoreSchema = z.object(actScoreValidators);

export type ActScoreSchema = typeof actScoreSchema;

export const apScoreSchema = z.object(apScoreValidators);

export type ApScoreSchema = typeof apScoreSchema;

export const ibGradeSchema = z.object(ibGradeValidators);

export type IbGradeSchema = typeof ibGradeSchema;

export const alevelGradeSchema = z.object(alevelGradeValidators);

export type AlevelGradeSchema = typeof alevelGradeSchema;

export const greScoreSchema = z.object(greScoreValidators);

export type GreScoreSchema = typeof greScoreSchema;

export const gmatScoreSchema = z.object(gmatScoreValidators);

export type GmatScoreSchema = typeof gmatScoreSchema;

export const lsatScoreSchema = z.object(lsatScoreValidators);

export type LsatScoreSchema = typeof lsatScoreSchema;

export type ScoreSchema =
	| ToeflScoreSchema
	| IeltsScoreSchema
	| DetScoreSchema
	| SatScoreSchema
	| ActScoreSchema
	| ApScoreSchema
	| IbGradeSchema
	| AlevelGradeSchema
	| GreScoreSchema
	| GmatScoreSchema
	| LsatScoreSchema;
