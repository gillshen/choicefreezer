import { fetchPrograms } from '$lib/api';
import type { ProgramListItem } from '$lib/types/programTypes';

export async function load() {
	const programs: ProgramListItem[] = await fetchPrograms();
	return { programs };
}
