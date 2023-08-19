export function toUsernamesWithRole(
	services: { role: string; cf_username: string }[],
	role: string
): string {
	return joinSortedNames(services.filter((s) => s.role === role));
}

export function joinSortedNames(
	services: { cf_username: string }[],
	joinWith: string = ', '
): string {
	return services
		.map((s) => s.cf_username)
		.sort()
		.join(joinWith);
}
