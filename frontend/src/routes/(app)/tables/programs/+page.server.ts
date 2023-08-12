import { fetchPrograms } from '$lib/api';

export function load() {
	return { programs: fetchPrograms() };
}
