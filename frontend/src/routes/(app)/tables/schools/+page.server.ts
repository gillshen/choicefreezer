import { fetchSchools } from '$lib/api';

export function load() {
	return { schools: fetchSchools() };
}
