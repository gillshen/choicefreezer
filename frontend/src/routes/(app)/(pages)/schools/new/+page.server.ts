import { message, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';

import type { NewSchool } from '$lib/types/schoolTypes.js';
import { newSchoolSchema } from '$lib/schemas.js';
import { createProgram, createSchool } from '$lib/api.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event) {
	const form = await superValidate(event, newSchoolSchema);
	return { form };
}

export const actions = {
	createSchool: async (event) => {
		const form = await superValidate(event, newSchoolSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { data } = form;

		const createSchoolResponse = await createSchool(data as NewSchool);
		if (!createSchoolResponse.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		const newSchool = await createSchoolResponse.json();
		console.log(newSchool);

		if (data.ugFreshmanRelevant) {
			await createProgram({ type: 'UG Freshman', name: '', degree: '', schools: [newSchool.id] });
		}
		if (data.ugTransferRelevant) {
			await createProgram({ type: 'UG Transfer', name: '', degree: '', schools: [newSchool.id] });
		}

		// Redirect to the school page
		throw redirect(302, `../schools/${newSchool.id}/`);
	}
};
