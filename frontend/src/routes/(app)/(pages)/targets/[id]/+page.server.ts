import { error } from '@sveltejs/kit';
import {
	fetchApplicationsOfTarget,
	fetchRequirementsOfTarget,
	fetchSubTargetsOfTarget,
	fetchTarget
} from '$lib/api.js';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const target = await fetchTarget(id);

	if (target?.id === undefined) {
		throw error(404, 'Not found');
	}

	return {
		target,
		subTargets: fetchSubTargetsOfTarget(id),
		requirements: fetchRequirementsOfTarget(id),
		applications: fetchApplicationsOfTarget(id)
	};
}
