import type { UserListItem } from '$lib/types/userTypes';
import { PLANNER, ESSAY_ADVISOR, PLUS_SUFFIX } from '$lib/constants/cfRoles';

export function sortByUsername(users: UserListItem[]) {
	return users.sort((a, b) => a.username.localeCompare(b.username));
}

export function filterForPlanners(users: UserListItem[]) {
	return users.filter((user) => user.department.includes(PLANNER));
}

export function filterForEssayAdvisors(users: UserListItem[]) {
	return users.filter((user) => user.department.includes(ESSAY_ADVISOR));
}

export function filterForSpecial(users: UserListItem[]) {
	return users.filter((user) => user.department.endsWith(PLUS_SUFFIX));
}

export function filterForActive(users: UserListItem[]) {
	return users.filter((user) => user.is_active);
}

export function filterForPlannersExcludingEssayAdvisors(users: UserListItem[]) {
	return users.filter(
		(user) => user.department.includes(PLANNER) && !user.department.includes(ESSAY_ADVISOR)
	);
}
