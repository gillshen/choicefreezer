import type { PageServerLoadEvent } from './$types.js';
import { error, fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import type { SuperValidated } from 'sveltekit-superforms/index.d.ts';

import {
	fetchACT,
	fetchAP,
	fetchContracts,
	fetchDET,
	fetchEnrollments,
	fetchGRE,
	fetchIELTS,
	fetchSAT,
	fetchStudent,
	fetchLogsOfStudents,
	fetchTOEFL,
	fetchApplicationsOfStudent,
	patchStudent,
	performCreateContract,
	fetchSchools,
	fetchProgramSelectList,
	createProgram,
	fetchOrCreateTarget,
	fetchOrCreateSubTarget,
	createApplication,
	createMajorChoice
} from '$lib/api';

import {
	studentLegalNameSchema,
	studentRomanizedNameSchema,
	studentGenderSchema,
	studentCitizenshipSchema,
	studentDateOfBirthSchema,
	studentResidenceSchema,
	studentCommentsSchema,
	contractSchema,
	applicationSchema
} from '$lib/schemas.js';

import type { Program, ProgramType } from '$lib/types/programTypes.js';
import type { NewTarget, Target, Term } from '$lib/types/targetTypes.js';
import type { NewSubTarget, SubTarget } from '$lib/types/subTargetTypes.js';
import type { NewApplication } from '$lib/types/applicationTypes.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';
import type { NewMajorChoice } from '$lib/types/majorChoiceTypes.js';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const student = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Not found');
	}

	const legalNameForm = await superValidate(student, studentLegalNameSchema);
	const romanizedNameForm = await superValidate(student, studentRomanizedNameSchema);
	const genderForm = await superValidate(student, studentGenderSchema);
	const citizenshipForm = await superValidate(student, studentCitizenshipSchema);
	const dateOfBirthForm = await superValidate(student, studentDateOfBirthSchema);
	const residenceForm = await superValidate(student, studentResidenceSchema);
	const commentsForm = await superValidate(student, studentCommentsSchema);

	const contractCreateForm = await superValidate(event, contractSchema);

	const applicationCreateForm = await superValidate(event, applicationSchema);

	return {
		// profile
		student,
		legalNameForm,
		romanizedNameForm,
		genderForm,
		citizenshipForm,
		dateOfBirthForm,
		residenceForm,
		commentsForm,
		// contracts
		contracts: fetchContracts(id),
		contractCreateForm,
		applicationCreateForm,
		// logs
		logs: fetchLogsOfStudents(id),
		// enrollments
		enrollments: fetchEnrollments(id),
		// test scores
		toeflScores: fetchTOEFL(id),
		ieltslScores: fetchIELTS(id),
		detScores: fetchDET(id),
		satScores: fetchSAT(id),
		actScores: fetchACT(id),
		apScores: fetchAP(id),
		greScores: fetchGRE(id),
		applications: fetchApplicationsOfStudent(id),
		// application form data:
		schools: fetchSchools(),
		programs: fetchProgramSelectList()
	};
}

export const actions = {
	updateLegalName: async (event) => {
		const form = await superValidate(event, studentLegalNameSchema);
		return await performStudentPatch(form);
	},

	updateRomanizedName: async (event) => {
		const form = await superValidate(event, studentRomanizedNameSchema);
		return await performStudentPatch(form);
	},

	updateGender: async (event) => {
		const form = await superValidate(event, studentGenderSchema);
		return await performStudentPatch(form);
	},

	updateCitizenship: async (event) => {
		const form = await superValidate(event, studentCitizenshipSchema);
		return await performStudentPatch(form);
	},

	updateDateOfBirth: async (event) => {
		const form = await superValidate(event, studentDateOfBirthSchema);
		return await performStudentPatch(form);
	},

	updateResidence: async (event) => {
		const form = await superValidate(event, studentResidenceSchema);
		return await performStudentPatch(form);
	},

	updateComments: async (event) => {
		const form = await superValidate(event, studentCommentsSchema);
		return await performStudentPatch(form);
	},

	createContract: async (event) => {
		const form = await superValidate(event, contractSchema);
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

	createApplication: async (event) => {
		const form = await superValidate(event, applicationSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		const { data } = form;

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

		// TODO refactor? Create major choices

		if (data.firstMajor) {
			const firstMajorParams: NewMajorChoice = {
				application: createdApplication.id,
				major_category: data.firstMajorCategory,
				major: data.firstMajor,
				rank: 1
			};
			const firstMajorResponse = await createMajorChoice(firstMajorParams);
			if (!firstMajorResponse.ok) {
				return message(form, UNKNOWN_ERROR, { status: 400 });
			}
		}

		if (data.secondMajor) {
			const secondMajorParams: NewMajorChoice = {
				application: createdApplication.id,
				major_category: data.secondMajorCategory,
				major: data.secondMajor,
				rank: 2
			};
			const secondMajorResponse = await createMajorChoice(secondMajorParams);
			if (!secondMajorResponse.ok) {
				return message(form, UNKNOWN_ERROR, { status: 400 });
			}
		}

		if (data.thirdMajor) {
			const thirdMajorParams: NewMajorChoice = {
				application: createdApplication.id,
				major_category: data.thirdMajorCategory,
				major: data.thirdMajor,
				rank: 2
			};
			const thirdMajorResponse = await createMajorChoice(thirdMajorParams);
			if (!thirdMajorResponse.ok) {
				return message(form, UNKNOWN_ERROR, { status: 400 });
			}
		}

		throw redirect(301, `../applications/${createdApplication.id}/`);
	}
};

async function performStudentPatch(form: SuperValidated<any, any>) {
	if (!form.valid) {
		return fail(400, { form });
	}
	const response = await patchStudent(form.data.id, form.data);
	if (!response.ok) {
		const messageText = 'Sorry, an unexpected error occurred. Please contact tech support.';
		return message(form, messageText, { status: 400 });
	}
	return { form };
}
