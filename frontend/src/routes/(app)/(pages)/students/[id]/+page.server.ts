import type { PageServerLoadEvent } from './$types.js';
import { error, fail } from '@sveltejs/kit';

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
	fetchProgramSelectList
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

	// TODO
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
			const messageText = 'Sorry, an unexpected error occurred. Please contact tech support.';
			return message(form, messageText, { status: 400 });
		}
		return { form };
	},

	createApplication: async (event) => {
		const form = await superValidate(event, applicationSchema);
		console.log(form);
		if (!form.valid) {
			return fail(400, { form });
		}
		return { form };
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
