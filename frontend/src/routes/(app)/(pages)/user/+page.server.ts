import { fail } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms/server';

import { fetchUser, patchUser, resetUserPassword } from '$lib/api.js';
import { userBannersUpdateSchema, userPasswordResetSchema } from '$lib/schemas.js';

import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

export async function load(event) {
	const { username } = await event.parent();
	const userProfile = await fetchUser(username);

	const bannersUpdateForm = await superValidate(userProfile, userBannersUpdateSchema);
	const passwordResetForm = await superValidate(event, userPasswordResetSchema);

	return {
		bannersUpdateForm,
		passwordResetForm
	};
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

		return { form };
	},

	resetPassword: async (event) => {
		const form = await superValidate(event, userPasswordResetSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await resetUserPassword(form.data.username, form.data);
		if (!response.ok) {
			return message(form, UNKNOWN_ERROR, { status: 400 });
		}

		event.cookies.delete('user_id');
		event.cookies.delete('username');
		event.cookies.delete('access');
		event.cookies.delete('refresh');

		return { form };
	}
};
