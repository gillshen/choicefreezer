import { invalidateAll } from '$app/navigation';
import { UNKNOWN_ERROR } from '$lib/constants/messages';
import { toast } from '$lib/utils/interactiveUtils';

export function scoreDeleter(
	deleteApiCall: (scoreId: number) => Promise<Response>,
	scoreId: number
) {
	return async () => {
		const response = await deleteApiCall(scoreId);
		if (response.ok) {
			toast('Score deleted', 'success');
			invalidateAll();
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	};
}
