export function sortCountries(a: string, b: string) {
	// Put China and the US at the top
	if (a === 'China' || (a === 'United States' && b !== 'China')) {
		return -1;
	} else if (b === 'China' || (b === 'United States' && a !== 'China')) {
		return 1;
	} else {
		return a.localeCompare(b);
	}
}
