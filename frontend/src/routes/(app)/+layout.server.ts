import { fetchUsers } from '$lib/api';

export function load() {
	return { cfPeople: fetchUsers() };
}
