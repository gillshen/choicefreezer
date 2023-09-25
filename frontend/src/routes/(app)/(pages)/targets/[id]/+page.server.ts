import { error, fail } from '@sveltejs/kit';
import {
	fetchApplicationsOfTarget,
	fetchOrCreateSubTarget,
	fetchRequirementsOfTarget,
	fetchSubTargetsOfTarget,
	fetchTarget,
	patchSubTarget,
	patchTarget
} from '$lib/api.js';
import { message, superValidate } from 'sveltekit-superforms/server';
import { cfRankSchema, subTargetSchema } from '$lib/schemas.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event) {
	const id = parseInt(event.params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const target = await fetchTarget(id);

	if (target?.id === undefined) {
		throw error(404, 'Not found');
	}

	const rankUpdateForm = await superValidate(target, cfRankSchema);
	const subTargetCreateForm = await superValidate(event, subTargetSchema);
	const subTargetUpdateForm = await superValidate(event, subTargetSchema);

	return {
		target,
		rankUpdateForm,
		subTargetCreateForm,
		subTargetUpdateForm,
		subTargets: fetchSubTargetsOfTarget(id),
		requirements: fetchRequirementsOfTarget(id),
		applications: fetchApplicationsOfTarget(id)
	};
}

export const actions = {
	updateCfRank: async (event) => {
		const form = await superValidate(event, cfRankSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchTarget(form.data.id, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		return { form };
	},

	createSubTarget: async (event) => {
		const form = await superValidate(event, subTargetSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await fetchOrCreateSubTarget(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	},

	updateSubTarget: async (event) => {
		const form = await superValidate(event, subTargetSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchSubTarget(form.data.id!, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return { form };
	}
};
