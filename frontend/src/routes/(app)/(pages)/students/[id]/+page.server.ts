import type { PageServerLoadEvent, RequestEvent } from './$types.js';
import { error, fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';

import {
	fetchActScores,
	fetchApScores,
	fetchContractsOfStudent,
	fetchDetScores,
	fetchEnrollments,
	fetchGmatScores,
	fetchGreScores,
	fetchIeltsScores,
	fetchSatScores,
	fetchStudent,
	fetchToeflScores,
	fetchApplicationsOfStudent,
	fetchLogsOfStudents,
	patchStudent,
	performCreateContract,
	fetchSchools,
	fetchProgramSelectList,
	fetchOrCreateTarget,
	fetchOrCreateSubTarget,
	createProgram,
	createApplication,
	createMajorChoice,
	createEnrollment,
	createToeflScore,
	createIeltsScore,
	createDetScore,
	createSatScore,
	createActScore,
	createApScore,
	createGreScore,
	createGmatScore,
	fetchIbPredictedGrades,
	fetchAlevelGrades,
	fetchLsatScores,
	createIbPredictedGrade,
	createAlevelGrade,
	createLsatScore,
	createIbFinalGrade,
	fetchIbFinalGrades
} from '$lib/api';

import {
	studentUpdateSchema,
	contractServiceSchema,
	newApplicationSchema,
	enrollmentSchema,
	toeflScoreSchema,
	ieltsScoreSchema,
	detScoreSchema,
	satScoreSchema,
	actScoreSchema,
	apScoreSchema,
	greScoreSchema,
	gmatScoreSchema,
	ibGradeSchema,
	alevelGradeSchema,
	lsatScoreSchema
} from '$lib/schemas.js';

import type { Program, ProgramType } from '$lib/types/programTypes.js';
import type { NewTarget, Target, Term } from '$lib/types/targetTypes.js';
import type { NewSubTarget, SubTarget } from '$lib/types/subTargetTypes.js';
import type { NewApplication } from '$lib/types/applicationTypes.js';
import type { NewMajorChoice } from '$lib/types/majorChoiceTypes.js';
import type { NewEnrollment } from '$lib/types/enrollmentTypes.js';

import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const student = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Not found');
	}

	const schools = await fetchSchools();
	const programs = await fetchProgramSelectList();

	const contracts = await fetchContractsOfStudent(id);
	const applications = await fetchApplicationsOfStudent(id);
	const logs = await fetchLogsOfStudents(id);

	return {
		student,
		studentUpdateForm: superValidate(student, studentUpdateSchema),
		// contracts
		contracts,
		contractCreateForm: superValidate(event, contractServiceSchema),
		applicationCreateForm: superValidate(event, newApplicationSchema),
		// applications & user logs
		applications,
		logs,
		// enrollments
		enrollments: fetchEnrollments(id),
		enrollmentCreateForm: superValidate(event, enrollmentSchema),
		// test scores
		toeflScores: fetchToeflScores(id),
		toeflScoreCreateForm: superValidate(event, toeflScoreSchema),
		ieltsScores: fetchIeltsScores(id),
		ieltsScoreCreateForm: superValidate(event, ieltsScoreSchema),
		detScores: fetchDetScores(id),
		detScoreCreateForm: superValidate(event, detScoreSchema),
		satScores: fetchSatScores(id),
		satScoreCreateForm: superValidate(event, satScoreSchema),
		actScores: fetchActScores(id),
		actScoreCreateForm: superValidate(event, actScoreSchema),
		apScores: fetchApScores(id),
		apScoreCreateForm: superValidate(event, apScoreSchema),
		ibPredictedGrades: fetchIbPredictedGrades(id),
		ibPredictedGradeCreateForm: superValidate(event, ibGradeSchema),
		ibFinalGrades: fetchIbFinalGrades(id),
		ibFinalGradeCreateForm: superValidate(event, ibGradeSchema),
		alevelGrades: fetchAlevelGrades(id),
		alevelGradeCreateForm: superValidate(event, alevelGradeSchema),
		greScores: fetchGreScores(id),
		greScoreCreateForm: superValidate(event, greScoreSchema),
		gmatScores: fetchGmatScores(id),
		gmatScoreCreateForm: superValidate(event, gmatScoreSchema),
		lsatScores: fetchLsatScores(id),
		lsatScoreCreateForm: superValidate(event, lsatScoreSchema),
		// application form data:
		schools,
		programs
	};
}

export const actions = {
	updateStudent: async (event: RequestEvent) => {
		const form = await superValidate(event, studentUpdateSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await patchStudent(form.data.id, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createContract: async (event: RequestEvent) => {
		const form = await superValidate(event, contractServiceSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			await performCreateContract({ studentId: form.data.studentId, formData: form.data });
		} catch (error) {
			console.log(error);
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createApplication: async (event: RequestEvent) => {
		const form = await superValidate(event, newApplicationSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		const { data } = form;

		// Check if majors are assigned to categories as they should
		const majorCategoryError = 'Since you have specified a major, you need to assign it a category';

		if (data.firstMajor && !data.firstMajorCategory) {
			form.errors.firstMajorCategory = [majorCategoryError];
			return fail(400, { form });
		}
		if (data.secondMajor && !data.secondMajorCategory) {
			form.errors.secondMajorCategory = [majorCategoryError];
			return fail(400, { form });
		}
		if (data.thirdMajor && !data.thirdMajorCategory) {
			form.errors.thirdMajorCategory = [majorCategoryError];
			return fail(400, { form });
		}

		// Create a new program
		if (data.programId === 0) {
			const newProgram = {
				type: data.programType as ProgramType,
				name: data.programName,
				degree: data.programDegree,
				schools: [data.schoolId]
			};
			if (data.secondSchoolId) {
				newProgram.schools.push(data.secondSchoolId);
			}
			const createProgramResponse = await createProgram(newProgram);
			if (!createProgramResponse.ok) {
				return message(form, UNKNOWN_ERROR, { status: 400 });
			}
			const createdProgram: Program = await createProgramResponse.json();
			data.programId = createdProgram.id;
		}

		const targetParams: NewTarget = {
			program: data.programId,
			year: data.year,
			term: data.term as Term
		};
		const targetResponse = await fetchOrCreateTarget(targetParams);
		if (!targetResponse.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		const target: Target = await targetResponse.json();

		const subTargetParams: NewSubTarget = {
			target: target.id,
			admission_plan: data.admissionPlan
		};
		const subTargetResponse = await fetchOrCreateSubTarget(subTargetParams);
		if (!subTargetResponse.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		const subTarget: SubTarget = await subTargetResponse.json();

		const applicationParams: NewApplication = {
			student: data.studentId,
			subtarget: subTarget.id
		};
		const createApplicationResponse = await createApplication(applicationParams);
		if (!createApplicationResponse.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		const createdApplication = await createApplicationResponse.json();

		// Create major choices
		let majorRank = 1;

		for (const [major, majorCategory] of [
			[data.firstMajor, data.firstMajorCategory],
			[data.secondMajor, data.secondMajorCategory],
			[data.thirdMajor, data.thirdMajorCategory]
		]) {
			if (major) {
				const params: NewMajorChoice = {
					application: createdApplication.id,
					major,
					major_category: majorCategory!,
					rank: majorRank
				};
				const majorResponse = await createMajorChoice(params);
				if (!majorResponse.ok) {
					return message(form, UNKNOWN_ERROR, { status: 400 });
				}
				majorRank++;
			}
		}

		throw redirect(301, `../applications/${createdApplication.id}/`);
	},

	createEnrollment: async (event: RequestEvent) => {
		const form = await superValidate(event, enrollmentSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createEnrollment(form.data as NewEnrollment);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		return { form };
	},

	createToeflScore: async (event: RequestEvent) => {
		const form = await superValidate(event, toeflScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createToeflScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createIeltsScore: async (event: RequestEvent) => {
		const form = await superValidate(event, ieltsScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createIeltsScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createDetScore: async (event: RequestEvent) => {
		const form = await superValidate(event, detScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createDetScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createSatScore: async (event: RequestEvent) => {
		const form = await superValidate(event, satScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createSatScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createActScore: async (event: RequestEvent) => {
		const form = await superValidate(event, actScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createActScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createApScore: async (event: RequestEvent) => {
		const form = await superValidate(event, apScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createApScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createIbPredictedGrade: async (event: RequestEvent) => {
		const form = await superValidate(event, ibGradeSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createIbPredictedGrade(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createIbFinalGrade: async (event: RequestEvent) => {
		const form = await superValidate(event, ibGradeSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createIbFinalGrade(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createAlevelScore: async (event: RequestEvent) => {
		const form = await superValidate(event, alevelGradeSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createAlevelGrade(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createGreScore: async (event: RequestEvent) => {
		const form = await superValidate(event, greScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createGreScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createGmatScore: async (event: RequestEvent) => {
		const form = await superValidate(event, gmatScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createGmatScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createLsatScore: async (event: RequestEvent) => {
		const form = await superValidate(event, lsatScoreSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createLsatScore(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	}
};
