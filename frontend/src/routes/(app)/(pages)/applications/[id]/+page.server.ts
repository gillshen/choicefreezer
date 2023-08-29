import { error, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

import {
	createApplicationLog,
	createMajorChoice,
	deleteMajorChoice,
	fetchApplication,
	fetchOrCreateSubTarget,
	patchApplication,
	patchMajorChoice,
	patchSubTarget
} from '$lib/api.js';
import {
	applicationUpdateSchema,
	deadlineUpdateSchema,
	newApplicationLogSchema
} from '$lib/schemas.js';
import type { NewApplicationLog } from '$lib/types/applicationLogTypes.js';
import type { NewSubTarget, SubTarget } from '$lib/types/subTargetTypes.js';
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

	const firstMajorChoice = application.major_choices.filter((mc) => mc.rank === 1)[0];
	const secondMajorChoice = application.major_choices.filter((mc) => mc.rank === 2)[0];
	const thirdMajorChoice = application.major_choices.filter((mc) => mc.rank === 3)[0];

	const applicationUpdateForm = await superValidate(
		{
			id: application.id,
			targetId: application.target.id,
			admissionPlan: application.subtarget.admission_plan,
			firstMajorId: firstMajorChoice?.id ?? null,
			firstMajor: firstMajorChoice?.major ?? null,
			firstMajorCategory: firstMajorChoice?.major_category ?? '',
			secondMajorId: secondMajorChoice?.id ?? null,
			secondMajor: secondMajorChoice?.major ?? null,
			secondMajorCategory: secondMajorChoice?.major_category ?? '',
			thirdMajorId: thirdMajorChoice?.id ?? null,
			thirdMajor: thirdMajorChoice?.major ?? null,
			thirdMajorCategory: thirdMajorChoice?.major_category ?? ''
		},
		applicationUpdateSchema
	);

	const deadlineUpdateForm = await superValidate(
		{ ...application.subtarget },
		deadlineUpdateSchema
	);

	const logCreationForm = await superValidate(event, newApplicationLogSchema);

	return {
		application,
		applicationUpdateForm,
		deadlineUpdateForm,
		logCreationForm
	};
}

export const actions = {
	updateApplication: async (event) => {
		const form = await superValidate(event, applicationUpdateSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}
		const { data } = form;

		// Check if majors are assigned to categories as they should
		// TODO refactor duplicate code? See students/[id]
		const majorCategoryError = 'Since you have specified a major, you need to assign it a category';

		if (data.firstMajor && !data.firstMajorCategory) {
			form.errors.firstMajorCategory = [majorCategoryError];
			return fail(400, { form });
		}
		if (data.secondMajor && !data.secondMajorCategory) {
			form.errors.secondMajorCategory = [majorCategoryError];
			return fail(400, { form });
		}
		if (data.thirdMajor && !data.thirdMajorCategory) {
			form.errors.thirdMajorCategory = [majorCategoryError];
			return fail(400, { form });
		}

		// Get or create the subtarget
		const subTargetParams: NewSubTarget = {
			target: data.targetId,
			admission_plan: data.admissionPlan
		};
		const subTargetResponse = await fetchOrCreateSubTarget(subTargetParams);
		if (!subTargetResponse.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		const subTarget: SubTarget = await subTargetResponse.json();

		// Update the application with the (possibly) new subtarget
		const patchApplicationResponse = await patchApplication(data.id, { subtarget: subTarget.id });
		if (!patchApplicationResponse.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		// Update major choices:
		let majorRank = 1;

		for (const [majorId, major, majorCategory] of [
			[data.firstMajorId, data.firstMajor, data.firstMajorCategory],
			[data.secondMajorId, data.secondMajor, data.secondMajorCategory],
			[data.thirdMajorId, data.thirdMajor, data.thirdMajorCategory]
		]) {
			let majorResponse: Response | null = null;

			// id exists but the major field is null or empty, then it should be deleted
			if (majorId && !major) {
				majorResponse = await deleteMajorChoice(majorId as number);
			}
			// id exists and major is specified: patch
			else if (majorId) {
				majorResponse = await patchMajorChoice(majorId as number, {
					major,
					major_category: majorCategory,
					rank: majorRank
				});
				majorRank++;
			}
			// id was null but major is specified: a new major
			else if (major) {
				majorResponse = await createMajorChoice({
					application: data.id,
					major: major as string,
					major_category: majorCategory as string,
					rank: majorRank
				});
				majorRank++;
			}
			// the last case, null id and no major, can be safely ignored

			if (majorResponse && !majorResponse.ok) {
				return message(form, UNKNOWN_ERROR, { status: 400 });
			}
		}

		return { form };
	},

	updateDeadline: async (event) => {
		const form = await superValidate(event, deadlineUpdateSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await patchSubTarget(form.data.id, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		return { form };
	},

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
