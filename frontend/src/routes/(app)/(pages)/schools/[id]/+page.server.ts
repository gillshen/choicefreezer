import { message, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';

import { schoolUpdateSchema } from '$lib/schemas.js';
import { fetchSchool, fetchApplicationsOfSchool, patchSchool } from '$lib/api.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const school = await fetchSchool(id);

	if (school?.id === undefined) {
		throw error(404, 'Not found');
	}

	const form = await superValidate(school, schoolUpdateSchema);

	return {
		school,
		form,
		applications: fetchApplicationsOfSchool(id)
	};
}

export const actions = {
	updateSchool: async (event) => {
		const form = await superValidate(event, schoolUpdateSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchSchool(form.data.id, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		return { form };
	}
};
