import { fetchStudents } from '$lib/api';

export function load() {
	return { students: fetchStudents() };
}
