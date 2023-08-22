export function statusToClass(status: string): string {
	return status.replace(/ /g, '-').toLowerCase();
}
