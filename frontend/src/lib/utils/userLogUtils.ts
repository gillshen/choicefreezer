import type { UserLogListItem } from '$lib/types/userLogTypes';
import { toShortDate } from './dateUtils';

export function processLog(log: UserLogListItem): UserLogListItem {
	const date = toShortDate(log.date);
	const updated = toShortDate(log.updated);

	if (log.title.length) {
		return { ...log, date, updated };
	}

	// The title is empty
	const MAX_TITLE_LENGTH = 12;

	if (log.text.length > MAX_TITLE_LENGTH) {
		return { ...log, date, title: `${log.text.slice(0, 17)}...`, updated };
	} else {
		return { ...log, date, title: log.text, text: '', updated };
	}
}
