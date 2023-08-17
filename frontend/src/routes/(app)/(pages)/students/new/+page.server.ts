import { message, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';

import { newStudentSchema } from '$lib/schemas.js';
import { createStudent, performCreateContract } from '$lib/api.js';

export async function load(event) {
	const form = await superValidate(event, newStudentSchema);
	return { form };
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, newStudentSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Call backend API to create a student
		const createStudentResponse = await createStudent(form.data);
		if (!createStudentResponse.ok) {
			return message(
				form,
				'Sorry, an error occurred while creating the student record. ' +
					'This may be because a student with the same name already exists. ' +
					"If that's not the case, please contact tech support.",
				{
					status: 400
				}
			);
		}

		const newStudent = await createStudentResponse.json();

		// Create the related contract and services
		try {
			await performCreateContract({ studentId: newStudent.id, formData: form.data });
		} catch (error) {
			console.error(error);
			return message(
				form,
				'Sorry, an unexpected error occurred while writing contract data. ' +
					'Please contact tech support.',
				{
					status: 400
				}
			);
		}

		// Redirect to student page
		throw redirect(302, `../students/${newStudent.id}/`);
	}
};
