import { error } from '@sveltejs/kit';
import type { User } from '$lib/types/userTypes.js';
import { fetchApplicationsOfUser, fetchUser } from '$lib/api.js';
import type { ApplicationListItem } from '$lib/types/applicationTypes.js';

export async function load({ params }) {
	const username = params.username;
	const user: User = await fetchUser(username);
	const applications: ApplicationListItem[] = await fetchApplicationsOfUser(username);

	if (user?.id === undefined) {
		throw error(404, 'Not found');
	}

	return {
		user,
		applications
	};
}
