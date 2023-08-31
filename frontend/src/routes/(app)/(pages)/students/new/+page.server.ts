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

		// Create the student
		const createStudentResponse = await createStudent(form.data);
		if (!createStudentResponse.ok) {
			return message(
				form,
				'Sorry, an error occurred while creating the student record, ' +
					'possibly because a student with the same name already exists. ' +
					'If this is not the case and the error persists, contact tech support.',
				{ status: 400 }
			);
		}

		const newStudent = await createStudentResponse.json();

		// Create the related contract and services

		// TODO performCreateContract will not throw errors even if operations fail
		try {
			await performCreateContract({ studentId: newStudent.id, formData: form.data });
		} catch (error) {
			console.error(error);
			return message(form, 'Sorry, something went wrong while writing contract data.', {
				status: 400
			});
		}

		// Redirect to student page
		throw redirect(302, `../students/${newStudent.id}/`);
	}
};
