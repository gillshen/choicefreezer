import { error } from '@sveltejs/kit';

import type { User } from '$lib/types/userTypes.js';
import type { UserLog } from '$lib/types/userLogTypes.js';
import type { ApplicationListItem } from '$lib/types/applicationTypes.js';
import { fetchApplicationsOfUser, fetchLogsOfUser, fetchUser } from '$lib/api.js';

export async function load({ params }) {
	const ownerName = params.username;
	const owner: User = await fetchUser(ownerName);
	const logs: UserLog[] = await fetchLogsOfUser(ownerName);
	const applications: ApplicationListItem[] = await fetchApplicationsOfUser(ownerName);

	if (owner?.id === undefined) {
		throw error(404, 'Not found');
	}

	return {
		owner,
		logs,
		applications
	};
}
