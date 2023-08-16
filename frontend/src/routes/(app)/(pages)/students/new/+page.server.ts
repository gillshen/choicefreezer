import { z } from 'zod';
import { message, superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';

import { studentValidators, selectionErrorMessage, contractValidators } from '$lib/validators.js';
import { createContract, createService, createStudent } from '$lib/api.js';

const newStudentSchema = z.object({
	// Student fields
	...studentValidators,

	// Contract fields
	...contractValidators,

	// Service fields
	cf_planner: z.number().positive(selectionErrorMessage),
	cf_asst_planner: z.number().nullable(),
	cf_strat_planner: z.number().nullable(),

	cf_essay_advisor_1: z.number().positive(selectionErrorMessage),
	cf_essay_advisor_2: z.number().nullable()
});

export async function load(event) {
	const form = await superValidate(event, newStudentSchema);
	return { form };
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, newStudentSchema);
		// console.log(form);

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

		try {
			// Create the related contract and services
			const createContractResponse = await createContract({
				student: newStudent.id,
				...form.data
			});
			const newContract = await createContractResponse.json();

			await createService({
				contract: newContract.id,
				cf_person: form.data.cf_planner,
				role: '顾问',
				start_date: form.data.date_signed
			});

			if (form.data.cf_asst_planner) {
				await createService({
					contract: newContract.id,
					cf_person: form.data.cf_asst_planner,
					role: '服务顾问',
					start_date: form.data.date_signed
				});
			}

			if (form.data.cf_strat_planner) {
				await createService({
					contract: newContract.id,
					cf_person: form.data.cf_strat_planner,
					role: '战略顾问',
					start_date: form.data.date_signed
				});
			}

			await createService({
				contract: newContract.id,
				cf_person: form.data.cf_essay_advisor_1,
				role: '文案',
				start_date: form.data.date_signed
			});

			if (form.data.cf_essay_advisor_2) {
				await createService({
					contract: newContract.id,
					cf_person: form.data.cf_essay_advisor_2,
					role: '文案',
					start_date: form.data.date_signed
				});
			}
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
