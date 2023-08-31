import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';

import { fetchUser, patchUser } from '$lib/api.js';
import { userBannersUpdateSchema } from '$lib/schemas.js';
import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event) {
	const { username } = await event.parent();
	const userProfile = await fetchUser(username);

	const bannersUpdateForm = await superValidate(userProfile, userBannersUpdateSchema);
	return { bannersUpdateForm };
}

export const actions = {
	updateBanners: async (event) => {
		const form = await superValidate(event, userBannersUpdateSchema);

		if (!form.valid) {
			return fail(400, { form });
		}
		const response = await patchUser(form.data.username, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}
		return message(form, 'success');
	}
};
