import { format } from 'date-fns';

export const THIS_YEAR = new Date().getFullYear();

export const MIN_YEAR = 2017;
export const MAX_YEAR = THIS_YEAR + 4;

export function getYearOptions() {
	// Return every year between MAX_YEAR and MIN_YEAR inclusive, descending
	const span = MAX_YEAR - MIN_YEAR;
	return Array.from(Array(span + 1).keys()).map((i) => MAX_YEAR - i);
}

export function toShortDate(dateString: string): string {
	return format(new Date(dateString), 'MMM d, y');
}

export function toTime(timeString: string): string {
	return format(new Date(`2022-01-06T${timeString}`), 'hh:mm bbbb');
}

export function toISODate(dateString: string): string {
	return format(new Date(dateString), 'y-LL-dd');
}

export function toISODateTime(dateString: string): string {
	return format(new Date(dateString), 'y-LL-dd HH:mm');
}
