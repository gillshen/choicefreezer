export function closeAndReloadOnSuccess(dialog: HTMLDialogElement | undefined) {
	/*
	 * The returned result is passed to superforms' event handler
	 * to close the dialog and reload the page.
	 * See https://superforms.rocks/concepts/events
	 */
	return ({ result }: any) => {
		if (result.type === 'success') {
			dialog?.close();
			/*
			 * Calling location.reload() immediately will cause a blank page
			 * with "200" and "Internal error" to be shown briefly before the
			 * normal page loads -- possibly because the immediate reload
			 * breaks something superform is doing. So wait for half a second.
			 */
			// setTimeout(() => location.reload(), 500);
		}
	};
}
