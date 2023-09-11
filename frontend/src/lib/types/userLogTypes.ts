import type { TASK_STATUSES } from '$lib/constants/taskStatuses';

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type UserLog = {
	id: number;
	author: number; // CfUser
	date: string;
	title: string;
	text: string;
	pinned: boolean;
	shared: boolean;
	task_status: TaskStatus; // '' | 'TODO' | 'Done';
	task_due: string | null; // time
	relevant_student: number | null; // Student
	updated: string; // datetime
};

export type NewUserLog = Omit<UserLog, 'id' | 'updated'>;

export type UserLogListItem = {
	id: number;
	author: {
		id: number;
		username: string;
	};
	date: string;
	title: string;
	text: string;
	pinned: boolean;
	shared: boolean;
	task_status: TaskStatus; // '' | 'TODO' | 'Done';
	task_due: string | null; // time
	relevant_student: { id: number; name: string } | null;
	updated: string; // datetime
};
