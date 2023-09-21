import { fetchEnrollment, fetchSchools, patchEnrollment } from '$lib/api';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoadEvent, RequestEvent } from './$types';
import { error, fail } from '@sveltejs/kit';
import { enrollmentSchema } from '$lib/schemas';
import { UNKNOWN_ERROR } from '$lib/constants/messages';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const enrollment = await fetchEnrollment(id);
	const enrollmentForm = await superValidate(event, enrollmentSchema);
	const schools = await fetchSchools();

	return {
		enrollment,
		enrollmentForm,
		schools
	};
}

export const actions = {
	updateEnrollment: async (event: RequestEvent) => {
		const form = await superValidate(event, enrollmentSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchEnrollment(form.data.id!, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	}
};
