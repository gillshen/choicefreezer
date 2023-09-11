import type { RequestEvent } from './$types.js';
import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { contractUpdateSchema, serviceSchema } from '$lib/schemas.js';
import { createService, fetchContract, patchContract, patchService } from '$lib/api.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const contract = await fetchContract(id);
	const contractForm = await superValidate(contract, contractUpdateSchema);

	const serviceCreationForm = await superValidate(event, serviceSchema);

	const serviceUpdateForm = await superValidate(event, serviceSchema);

	return {
		contract,
		contractForm,
		serviceCreationForm,
		serviceUpdateForm
	};
}

export const actions = {
	updateContract: async (event: RequestEvent) => {
		const form = await superValidate(event, contractUpdateSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchContract(form.data.id, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createService: async (event: RequestEvent) => {
		const form = await superValidate(event, serviceSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createService(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	updateService: async (event: RequestEvent) => {
		const form = await superValidate(event, serviceSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchService(form.data.id as number, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	}
};
