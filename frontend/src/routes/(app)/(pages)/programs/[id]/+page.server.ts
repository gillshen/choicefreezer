import { error, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

import { fetchApplicationsOfProgram, fetchProgram, patchProgram } from '$lib/api.js';
import { programUpdateSchema } from '$lib/schemas.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const program = await fetchProgram(id);

	if (program?.id === undefined) {
		throw error(404, 'Not found');
	}

	const programUpdateForm = superValidate(program, programUpdateSchema);

	return {
		program,
		programUpdateForm,
		applications: fetchApplicationsOfProgram(id)
	};
}

export const actions = {
	updateProgram: async (event) => {
		const form = await superValidate(event, programUpdateSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchProgram(form.data.id, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		return { form };
	}
};
