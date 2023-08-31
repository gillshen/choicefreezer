import type { User } from '$lib/types/userTypes.js';
import type { ApplicationListItem } from '$lib/types/applicationTypes.js';
import { fetchApplicationsOfUser, fetchUser } from '$lib/api.js';

export async function load({ parent }) {
	const { username } = await parent();
	const owner: User = await fetchUser(username);
	const applications: ApplicationListItem[] = await fetchApplicationsOfUser(username);

	return {
		owner,
		applications
	};
}
