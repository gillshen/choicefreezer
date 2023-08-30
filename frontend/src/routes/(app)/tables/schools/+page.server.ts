import { fetchSchools } from '$lib/api';
import type { SchoolListItem } from '$lib/types/schoolTypes';

export async function load() {
	const schools: SchoolListItem[] = await fetchSchools();
	return { schools };
}
