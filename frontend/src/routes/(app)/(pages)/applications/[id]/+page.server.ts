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
	decisionDateUpdateSchema,
	newApplicationLogSchema
} from '$lib/schemas.js';
import type { NewApplicationLog } from '$lib/types/applicationLogTypes.js';
import type { NewSubTarget, SubTarget } from '$lib/types/subTargetTypes.js';
import type { ApplicationStatus } from '$lib/types/applicationTypes.js';
import { MAJOR_CATEGORY_REQUIRED, UNKNOWN_ERROR } from '$lib/constants/messages.js';

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

	const applicationUpdateForm = await superValidate(event, applicationUpdateSchema);

	const deadlineUpdateForm = await superValidate(
		{ ...application.subtarget },
		deadlineUpdateSchema
	);

	const decisionDateUpdateForm = await superValidate(
		{ ...application.subtarget },
		decisionDateUpdateSchema
	);

	const logCreationForm = await superValidate(event, newApplicationLogSchema);

	return {
		application,
		applicationUpdateForm,
		firstMajorChoice,
		secondMajorChoice,
		thirdMajorChoice,
		deadlineUpdateForm,
		decisionDateUpdateForm,
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

		if (data.firstMajor && !data.firstMajorCategory) {
			form.errors.firstMajorCategory = [MAJOR_CATEGORY_REQUIRED];
			return fail(400, { form });
		}
		if (data.secondMajor && !data.secondMajorCategory) {
			form.errors.secondMajorCategory = [MAJOR_CATEGORY_REQUIRED];
			return fail(400, { form });
		}
		if (data.thirdMajor && !data.thirdMajorCategory) {
			form.errors.thirdMajorCategory = [MAJOR_CATEGORY_REQUIRED];
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
		const patchApplicationResponse = await patchApplication(data.id, {
			subtarget: subTarget.id,
			scholarship_amount: data.scholarshipAmount ?? 0,
			scholarship_currency: data.scholarshipCurrency ?? ''
		});
		if (!patchApplicationResponse.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		// Update major choices:
		let majorRank = 1;

		const majorChoices = [
			[data.firstMajorId, data.firstMajor, data.firstMajorCategory],
			[data.secondMajorId, data.secondMajor, data.secondMajorCategory],
			[data.thirdMajorId, data.thirdMajor, data.thirdMajorCategory]
		];

		for (const [majorId, major, majorCategory] of majorChoices) {
			let majorResponse: Response | null = null;

			// id exists but the major field is null or empty, then it should be deleted
			if (majorId && !major) {
				console.log('delete major', majorId);
				majorResponse = await deleteMajorChoice(majorId as number);
			}
			// id exists and major is specified: patch
			else if (majorId) {
				console.log('patch major', majorId, major);
				majorResponse = await patchMajorChoice(majorId as number, {
					major,
					major_category: majorCategory,
					rank: majorRank
				});
				majorRank++;
			}
			// id was null but major is specified: a new major
			else if (major) {
				console.log('create major', major);
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

	updateDecisionDate: async (event) => {
		const form = await superValidate(event, decisionDateUpdateSchema);
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
			const duplicableStatuses: ApplicationStatus[] = ['Under Review', 'Deferred', 'On Waitlist'];
			let possibleReason;

			if (duplicableStatuses.includes(form.data.status as ApplicationStatus)) {
				possibleReason =
					`possibly because "${form.data.status}" is already on the timeline. ` +
					'Duplication of this status is allowed, but only if you provide distinct comments on each occurrence';
			} else {
				possibleReason =
					`possibly because "${form.data.status}" is already on the timeline. ` +
					'Duplication of this status is not allowed';
			}
			return message(form, `${UNKNOWN_ERROR}, ${possibleReason}.`, { status: 400 });
		}

		if (form.data.scholarshipAmount) {
			const scholarshipResponse = await patchApplication(form.data.application, {
				scholarship_amount: form.data.scholarshipAmount,
				scholarship_currency: form.data.scholarshipCurrency
			});
			if (!scholarshipResponse.ok) {
				return message(form, UNKNOWN_ERROR, { status: 400 });
			}
		}

		return { form };
	}
};
