import { error } from '@sveltejs/kit';
import { fetchApplicationsOfSchool, fetchSchool } from '$lib/api.js';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const school = await fetchSchool(id);

	if (school?.id === undefined) {
		throw error(404, 'Not found');
	}

	return { school, applications: fetchApplicationsOfSchool(id) };
}
