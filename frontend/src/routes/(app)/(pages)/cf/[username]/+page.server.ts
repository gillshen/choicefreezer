import { error } from '@sveltejs/kit';
import { fetchApplicationsOfUser, fetchStudentsOfUser, fetchUserProfile } from '$lib/api.js';

export async function load({ params }) {
	const username = params.username;
	const userProfile = await fetchUserProfile(username);

	if (userProfile?.id === undefined) {
		throw error(404, 'Not found');
	}

	return {
		userProfile,
		students: fetchStudentsOfUser(username),
		applications: fetchApplicationsOfUser(username)
	};
}
