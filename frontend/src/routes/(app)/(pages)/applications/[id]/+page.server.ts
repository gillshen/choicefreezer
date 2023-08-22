import { error } from '@sveltejs/kit';
import { fetchApplication } from '$lib/api.js';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const application = await fetchApplication(id);

	if (application?.id === undefined) {
		throw error(404, 'Not found');
	}

	return { application };
}
