import { format } from 'date-fns';
import { TIMEZONES_MAP } from '$lib/constants/timezones';

export const THIS_YEAR = new Date().getFullYear();

export const MIN_YEAR = 2017;
export const MAX_YEAR = THIS_YEAR + 4;

export function getYearOptions() {
	// Return every year between MAX_YEAR and MIN_YEAR inclusive, descending
	const span = MAX_YEAR - MIN_YEAR;
	return Array.from(Array(span + 1).keys()).map((i) => MAX_YEAR - i);
}

export function makeDate(date: Date | string): Date {
	const newDate = new Date(date);
	newDate.setHours(0);
	newDate.setMinutes(0);
	newDate.setSeconds(0);
	newDate.setMilliseconds(0);
	return newDate;
}

export function currentDateString() {
	return format(new Date(), 'y-LL-dd');
}

export function toLongDate(dateString: string): string {
	return format(new Date(dateString), 'MMMM d, y');
}

export function toShortDate(dateString: string): string {
	return format(new Date(dateString), 'MMM d, y');
}

export function toShortDateWithoutYear(dateString: string): string {
	return format(new Date(dateString), 'MMM d');
}

export function toConciseDate(dateString: string): string {
	if (new Date(dateString).getFullYear() === new Date().getFullYear()) {
		return toShortDateWithoutYear(dateString);
	}
	return toShortDate(dateString);
}

export function toMonthYear(dateString: string): string {
	return format(new Date(dateString), 'MMM y');
}

export function toYear(dateString: string): string {
	return format(new Date(dateString), 'y');
}

export function toTime(timeString: string): string {
	return format(new Date(`2022-01-06T${timeString}`), 'hh:mm bbb');
}

export function toShortTime(timeString: string): string {
	return format(new Date(`2022-01-06T${timeString}`), 'h:mm bbb');
}

export function toISODate(dateString: string): string {
	return format(new Date(dateString), 'y-LL-dd');
}

export function toISODateTime(dateString: string): string {
	return format(new Date(dateString), 'y-LL-dd HH:mm');
}

export function formatTimezone(tz: string): string {
	return TIMEZONES_MAP.get(tz)?.replace(/UTC-/g, 'UTC\u2212') ?? '';
}
