import { fetchApplications } from '$lib/api';

export function load() {
	return { applications: fetchApplications() };
}
