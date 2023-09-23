import { message, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { patchClassRank, patchGpa } from '$lib/api.js';
import { classRankSchema, gpaSchema } from '$lib/schemas.js';
import {
	CLASS_SIZE_REQUIRED,
	RANK_REQUIRED,
	RANK_SPECIFY_ONCE,
	UNKNOWN_ERROR
} from '$lib/constants/messages.js';

export const actions = {
	updateGpa: async (event) => {
		const form = await superValidate(event, gpaSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchGpa(form.data.id!, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	updateClassRank: async (event) => {
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

		const response = await patchClassRank(data.id!, data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	}
};
