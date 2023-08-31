import { redirect } from '@sveltejs/kit';
import { fetchUsers } from '$lib/api';

export function load(event) {
	const username = event.cookies.get('username');

	// Redirect if not authenticated
	if (!username) {
		throw redirect(302, '../login');
	}

	return {
		username,
		cfPeople: fetchUsers()
	};
}
