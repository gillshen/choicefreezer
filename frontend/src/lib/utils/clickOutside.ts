export function clickOutside(
	element: HTMLElement,
	callback: () => void
): {
	update: (newCallback: () => void) => void;
	destroy: () => void;
} {
	/* Source:
	 * https://svelte.dev/repl/8031c800d7e34fd692dd18174b514e4e?version=3.49.0
	 */
	function onClick(event: MouseEvent) {
		if (!element.contains(event.target as Node)) {
			callback();
		}
	}

	document.body.addEventListener('click', onClick);

	return {
		update(newCallback: () => void) {
			callback = newCallback;
		},
		destroy() {
			document.body.removeEventListener('click', onClick);
		}
	};
}
