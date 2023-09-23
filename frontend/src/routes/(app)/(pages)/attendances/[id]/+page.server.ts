import type { PageServerLoadEvent, RequestEvent } from './$types';
import { message, superValidate } from 'sveltekit-superforms/server';
import { error, fail } from '@sveltejs/kit';

import type { NewClassRank, NewGpa } from '$lib/types/enrollmentTypes';
import {
	createClassRank,
	createGpa,
	fetchEnrollment,
	fetchSchools,
	patchEnrollment
} from '$lib/api';
import { classRankSchema, enrollmentSchema, gpaSchema } from '$lib/schemas';
import {
	CLASS_SIZE_REQUIRED,
	RANK_REQUIRED,
	RANK_SPECIFY_ONCE,
	UNKNOWN_ERROR
} from '$lib/constants/messages';

export async function load(event: PageServerLoadEvent) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const enrollment = await fetchEnrollment(id);
	const enrollmentForm = await superValidate(event, enrollmentSchema);
	const schools = await fetchSchools();

	const gpaCreateForm = await superValidate(event, gpaSchema);
	const classRankCreateForm = await superValidate(event, classRankSchema);

	return {
		enrollment,
		enrollmentForm,
		schools,
		gpaCreateForm,
		classRankCreateForm
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
	},

	createGpa: async (event: RequestEvent) => {
		const form = await superValidate(event, gpaSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createGpa(form.data as NewGpa);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	createClassRank: async (event: RequestEvent) => {
		const form = await superValidate(event, classRankSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		const { data } = form;

		if (!data.rank && !data.top_x) {
			return message(form, RANK_REQUIRED, { status: 400 });
		}
		if (data.rank && data.top_x) {
			return message(form, RANK_SPECIFY_ONCE, { status: 400 });
		}
		if (data.rank && !data.class_size) {
			return message(form, CLASS_SIZE_REQUIRED, { status: 400 });
		}

		const response = await createClassRank(data as NewClassRank);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	}
};
