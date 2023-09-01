import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';

import type { User } from '$lib/types/userTypes.js';
import type { UserLogListItem } from '$lib/types/userLogTypes.js';
import type { ApplicationListItem } from '$lib/types/applicationTypes.js';
import { newUserLogSchema } from '$lib/schemas.js';
import { createUserLog, fetchApplicationsOfUser, fetchLogsOfUser, fetchUser } from '$lib/api.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event) {
	const { username } = await event.parent();
	const owner: User = await fetchUser(username);
	const logs: UserLogListItem[] = await fetchLogsOfUser(username);
	const applications: ApplicationListItem[] = await fetchApplicationsOfUser(username);

	return {
		owner,
		logs,
		applications
	};
}

export const actions = {
	createLog: async (event) => {
		const form = await superValidate(event, newUserLogSchema);
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createUserLog(form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		return { form };
	}
};
