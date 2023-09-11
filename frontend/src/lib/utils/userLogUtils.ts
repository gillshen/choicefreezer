import type { UserLogListItem } from '$lib/types/userLogTypes';
import { toConciseDate } from './dateUtils';

export function processLog(log: UserLogListItem): UserLogListItem {
	const date = toConciseDate(log.date);
	const updated = toConciseDate(log.updated);

	if (log.title.length) {
		return { ...log, date, updated };
	}

	// The title is empty
	const MAX_TITLE_LENGTH = 12;

	if (log.text.length > MAX_TITLE_LENGTH) {
		return { ...log, date, title: `${log.text.slice(0, MAX_TITLE_LENGTH - 3)}...`, updated };
	} else {
		return { ...log, date, title: log.text, updated };
	}
}

export function countTasksTodo(logs: UserLogListItem[]) {
	return logs.filter((log) => log.task_status === 'TODO').length;
}

export function countTasksDone(logs: UserLogListItem[]) {
	return logs.filter((log) => log.task_status === 'Done').length;
}

export function filterLogByDate(log: UserLogListItem, dateFilter: string) {
	if (log.pinned) {
		return true;
	}

	const diffInMilliseconds = new Date().getTime() - new Date(log.date).getTime();
	const diffInDay = diffInMilliseconds / (24 * 60 * 60 * 1000);

	switch (dateFilter) {
		case 'Last 7 days':
			return diffInDay < 8;
		case 'Last 15 days':
			return diffInDay < 16;
		case 'Last 30 days':
			return diffInDay < 31;

		// match year and month
		default:
			return log.date.startsWith(dateFilter);
	}
}

export function filterLogByCategory(log: UserLogListItem, categoryFilter: string) {
	if (log.pinned) {
		return true;
	}

	switch (categoryFilter) {
		case 'TODO':
			return log.task_status === 'TODO';
		case 'Done':
			return log.task_status === 'Done';
		case 'Shared':
			return !!log.shared;
		case 'None of the above':
			return log.task_status === '' && !log.shared;
		default:
			return true;
	}
}
