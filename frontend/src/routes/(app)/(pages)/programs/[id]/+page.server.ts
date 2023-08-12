import { error } from '@sveltejs/kit';
import { fetchApplicationsOfProgram, fetchProgram } from '$lib/api.js';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const program = await fetchProgram(id);

	if (program?.id === undefined) {
		throw error(404, 'Not found');
	}

	return { program, applications: fetchApplicationsOfProgram(id) };
}
