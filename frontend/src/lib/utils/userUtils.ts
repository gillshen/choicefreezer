import type { UserListItem } from '$lib/types/userTypes';

export function sortByUsername(users: UserListItem[]) {
	return users.sort((a, b) => a.username.localeCompare(b.username));
}

export function filterForPlanners(users: UserListItem[]) {
	return users.filter((user) => user.department.includes('顾问'));
}

export function filterForEssayAdvisors(users: UserListItem[]) {
	return users.filter((user) => user.department.includes('文案'));
}

export function filterForSpecial(users: UserListItem[]) {
	return users.filter((user) => user.department.endsWith('+'));
}
