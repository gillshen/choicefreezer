import { error } from '@sveltejs/kit';
import { fetchApplicationsOfUser, fetchStudentsOfUser, fetchUser } from '$lib/api.js';

export async function load({ params }) {
	const username = params.username;
	const user = await fetchUser(username);

	if (user?.id === undefined) {
		throw error(404, 'Not found');
	}

	return {
		user,
		students: fetchStudentsOfUser(username),
		applications: fetchApplicationsOfUser(username)
	};
}
