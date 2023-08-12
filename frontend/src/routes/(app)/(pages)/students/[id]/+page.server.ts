import { error } from '@sveltejs/kit';
import {
	fetchACT,
	fetchAP,
	fetchContracts,
	fetchDET,
	fetchEnrollments,
	fetchGRE,
	fetchIELTS,
	fetchSAT,
	fetchStudent,
	fetchLogsOfStudents,
	fetchTOEFL,
	fetchApplicationsOfStudent
} from '$lib/api';

export async function load({ params }) {
	const id = parseInt(params.id, 10);

	if (isNaN(id)) {
		throw error(404, 'Not found');
	}

	const student = await fetchStudent(id);

	if (student?.id === undefined) {
		throw error(404, 'Not found');
	}

	return {
		student,
		contracts: fetchContracts(id),
		logs: fetchLogsOfStudents(id),
		enrollments: fetchEnrollments(id),
		toeflScores: fetchTOEFL(id),
		ieltslScores: fetchIELTS(id),
		detScores: fetchDET(id),
		satScores: fetchSAT(id),
		actScores: fetchACT(id),
		apScores: fetchAP(id),
		greScores: fetchGRE(id),
		applications: fetchApplicationsOfStudent(id)
	};
}
