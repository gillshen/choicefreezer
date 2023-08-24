import { fetchContract, patchContract } from '$lib/api.js';
import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { contractUpdateSchema } from '$lib/schemas.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const contract = await fetchContract(id);
	const contractForm = await superValidate(contract, contractUpdateSchema);

	return { contract, contractForm };
}

export const actions = {
	updateContract: async (event) => {
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
	}
};
