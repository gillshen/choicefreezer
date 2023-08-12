import { redirect } from '@sveltejs/kit';

export function load() {
	// TODO if user is not authenticated, direct to /login

	throw redirect(301, '../home');
}
