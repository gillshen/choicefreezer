export const THIS_YEAR = new Date().getFullYear();

export const MIN_YEAR = 2017;
export const MAX_YEAR = THIS_YEAR + 4;

export function getYearOptions() {
	// Return every year between MAX_YEAR and MIN_YEAR inclusive, descending
	const span = MAX_YEAR - MIN_YEAR;
	return Array.from(Array(span + 1).keys()).map((i) => MAX_YEAR - i);
}
