import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';
import { fail, redirect } from '@sveltejs/kit';

import { MIN_YEAR, THIS_YEAR } from '$lib/utils/dateUtils.js';
import { createContract, createService, createStudent } from '$lib/api.js';

const fieldErrorMessage = { message: 'This field is required' };
const selectionErrorMessage = { message: 'Select an option' };

const newStudentSchema = z.object({
	// Student fields
	last_name: z.string().trim().min(1, fieldErrorMessage),
	first_name: z.string().trim().min(1, fieldErrorMessage),
	name_in_chinese: z.boolean().default(true),

	last_name_romanized: z.string().trim().min(1, fieldErrorMessage),
	first_name_romanized: z.string().trim().min(1, fieldErrorMessage),

	gender: z.string().min(1, selectionErrorMessage),
	citizenship: z.string().min(1).default('China'),
	date_of_birth: z.string().nullable(),

	city: z.string().trim().default('').optional(),
	state: z.string().trim().default('').optional(),

	// Contract fields
	contract_type: z.string().min(1, selectionErrorMessage),

	contract_target_year: z
		.number()
		.gte(MIN_YEAR, selectionErrorMessage)
		.default(THIS_YEAR + 1),

	contract_date_signed: z.string().nullable(),
	contract_status: z.string().min(1, selectionErrorMessage),

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
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Call backend API
		const createStudentResponse = await createStudent(form.data);
		if (!createStudentResponse.ok) {
			// TODO client side handling
			return fail(createStudentResponse.status, { form });
		}

		// TODO handle errors that may occur below
		const newStudent = await createStudentResponse.json();

		const createContractResponse = await createContract({
			student: newStudent.id,
			type: form.data.contract_type,
			target_year: form.data.contract_target_year,
			date_signed: form.data.contract_date_signed,
			status: form.data.contract_status
		});
		const newContract = await createContractResponse.json();

		await createService({
			contract: newContract.id,
			cf_person: form.data.cf_planner,
			role: '顾问',
			start_date: form.data.contract_date_signed
		});

		if (form.data.cf_asst_planner) {
			await createService({
				contract: newContract.id,
				cf_person: form.data.cf_asst_planner,
				role: '服务顾问',
				start_date: form.data.contract_date_signed
			});
		}

		if (form.data.cf_strat_planner) {
			await createService({
				contract: newContract.id,
				cf_person: form.data.cf_strat_planner,
				role: '战略顾问',
				start_date: form.data.contract_date_signed
			});
		}

		await createService({
			contract: newContract.id,
			cf_person: form.data.cf_essay_advisor_1,
			role: '文案',
			start_date: form.data.contract_date_signed
		});

		if (form.data.cf_essay_advisor_2) {
			await createService({
				contract: newContract.id,
				cf_person: form.data.cf_essay_advisor_2,
				role: '文案',
				start_date: form.data.contract_date_signed
			});
		}

		// Redirect to student page
		throw redirect(302, `../students/${newStudent.id}/`);
	}
};
