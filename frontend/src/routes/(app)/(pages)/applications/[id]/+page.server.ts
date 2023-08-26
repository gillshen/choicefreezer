import { error, fail } from '@sveltejs/kit';
import { createApplicationLog, fetchApplication } from '$lib/api.js';
import { message, superValidate } from 'sveltekit-superforms/server';
import { newApplicationLogSchema } from '$lib/schemas.js';
import type { NewApplicationLog } from '$lib/types/applicationLogTypes.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const application = await fetchApplication(id);

	if (application?.id === undefined) {
		throw error(404, 'Not found');
	}

	const logCreationForm = await superValidate(event, newApplicationLogSchema);

	return {
		application,
		logCreationForm
	};
}

export const actions = {
	createLog: async (event) => {
		const form = await superValidate(event, newApplicationLogSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createApplicationLog(form.data as NewApplicationLog);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		return { form };
	}
};
