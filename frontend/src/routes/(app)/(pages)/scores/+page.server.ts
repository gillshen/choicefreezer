import type { RequestEvent } from './$types.js';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

import type {
	NewActScore,
	NewAlevelGrade,
	NewApScore,
	NewDetScore,
	NewGmatScore,
	NewGreScore,
	NewIbGrade,
	NewIeltsScore,
	NewLsatScore,
	NewSatScore,
	NewToeflScore
} from '$lib/types/testScoreTypes.js';
import {
	type ScoreSchema,
	type ToeflScoreSchema,
	type IeltsScoreSchema,
	type DetScoreSchema,
	type SatScoreSchema,
	type ActScoreSchema,
	type ApScoreSchema,
	type IbGradeSchema,
	type AlevelGradeSchema,
	type GreScoreSchema,
	type GmatScoreSchema,
	type LsatScoreSchema,
	ieltsScoreSchema,
	toeflScoreSchema,
	detScoreSchema,
	satScoreSchema,
	actScoreSchema,
	apScoreSchema,
	ibGradeSchema,
	alevelGradeSchema,
	greScoreSchema,
	gmatScoreSchema,
	lsatScoreSchema
} from '$lib/schemas.js';
import {
	createActScore,
	createAlevelFinalGrade,
	createAlevelPredictedGrade,
	createApScore,
	createDetScore,
	createGmatScore,
	createGreScore,
	createIbFinalGrade,
	createIbPredictedGrade,
	createIeltsScore,
	createLsatScore,
	createSatScore,
	createToeflScore,
	patchActScore,
	patchDetScore,
	patchGmatScore,
	patchGreScore,
	patchIeltsScore,
	patchLsatScore,
	patchSatScore,
	patchToeflScore
} from '$lib/api.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

function scoreCreater(
	schema: ToeflScoreSchema,
	createApiCall: (data: NewToeflScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: IeltsScoreSchema,
	createApiCall: (data: NewIeltsScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: DetScoreSchema,
	createApiCall: (data: NewDetScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: SatScoreSchema,
	createApiCall: (data: NewSatScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: ActScoreSchema,
	createApiCall: (data: NewActScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: ApScoreSchema,
	createApiCall: (data: NewApScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: ApScoreSchema,
	createApiCall: (data: NewApScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: IbGradeSchema,
	createApiCall: (data: NewIbGrade) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: AlevelGradeSchema,
	createApiCall: (data: NewAlevelGrade) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: GreScoreSchema,
	createApiCall: (data: NewGreScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: GmatScoreSchema,
	createApiCall: (data: NewGmatScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(
	schema: LsatScoreSchema,
	createApiCall: (data: NewLsatScore) => Promise<Response>
): (event: RequestEvent) => any;

function scoreCreater(schema: any, createApiCall: any) {
	return async (event: RequestEvent) => {
		const form = await superValidate(event, schema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await createApiCall(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	};
}

function scorePatcher(
	schema: ScoreSchema,
	patchApiCall: (scoreId: number, data: any) => Promise<Response>
) {
	return async (event: RequestEvent) => {
		const form = await superValidate(event, schema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await patchApiCall(form.data.id!, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	};
}

export const actions = {
	createToeflScore: scoreCreater(toeflScoreSchema, createToeflScore),
	updateToeflScore: scorePatcher(toeflScoreSchema, patchToeflScore),

	createIeltsScore: scoreCreater(ieltsScoreSchema, createIeltsScore),
	updateIeltsScore: scorePatcher(ieltsScoreSchema, patchIeltsScore),

	createDetScore: scoreCreater(detScoreSchema, createDetScore),
	updateDetScore: scorePatcher(detScoreSchema, patchDetScore),

	createSatScore: scoreCreater(satScoreSchema, createSatScore),
	updateSatScore: scorePatcher(satScoreSchema, patchSatScore),

	createActScore: scoreCreater(actScoreSchema, createActScore),
	updateActScore: scorePatcher(actScoreSchema, patchActScore),

	createApScore: scoreCreater(apScoreSchema, createApScore),

	createIbPredictedGrade: scoreCreater(ibGradeSchema, createIbPredictedGrade),
	createIbFinalGrade: scoreCreater(ibGradeSchema, createIbFinalGrade),

	createAlevelPredictedGrade: scoreCreater(alevelGradeSchema, createAlevelPredictedGrade),
	createAlevelFinalGrade: scoreCreater(alevelGradeSchema, createAlevelFinalGrade),

	createGreScore: scoreCreater(greScoreSchema, createGreScore),
	updateGreScore: scorePatcher(greScoreSchema, patchGreScore),

	createGmatScore: scoreCreater(gmatScoreSchema, createGmatScore),
	updateGmatScore: scorePatcher(gmatScoreSchema, patchGmatScore),

	createLsatScore: scoreCreater(lsatScoreSchema, createLsatScore),
	updateLsatScore: scorePatcher(lsatScoreSchema, patchLsatScore)
};
