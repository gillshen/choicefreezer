import { fail, redirect } from '@sveltejs/kit';
import jwt_decode from 'jwt-decode';
import { message, superValidate } from 'sveltekit-superforms/server';
import { authenticate } from '$lib/api.js';
import { authenticationSchema } from '$lib/schemas.js';

export async function load(event) {
	const username = event.cookies.get('username');
	if (username) {
		throw redirect(302, '../home');
	}

	const authenticationForm = await superValidate(event, authenticationSchema);
	return { authenticationForm };
}

export const actions = {
	login: async (event) => {
		const form = await superValidate(event, authenticationSchema);
		if (!form.valid) {
			form.data.password = '';
			return fail(400, { form });
		}

		const response = await authenticate(form.data);

		// Authentication failed
		if (!response.ok) {
			form.data.password = '';
			return message(form, 'Incorrect username or password', { status: 403 });
		}

		// Authentication successful
		const { access, refresh } = await response.json();
		const { user_id, username } = jwt_decode(access) as { user_id: string; username: string };

		event.cookies.set('access', access, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // 1 day
		});

		event.cookies.set('refresh', refresh, {
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 15 // 15 days
		});

		event.cookies.set('user_id', user_id, { httpOnly: true, sameSite: 'strict' });
		event.cookies.set('username', username, { httpOnly: true, sameSite: 'strict' });

		throw redirect(302, '../home');
	}
};
