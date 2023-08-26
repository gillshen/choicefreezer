export function closeDialogOnSuccess(result: { type: string }, dialog: HTMLDialogElement) {
	if (result.type === 'success') dialog.close();
}
