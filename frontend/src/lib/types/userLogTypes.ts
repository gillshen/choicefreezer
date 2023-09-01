export type UserLog = {
	id: number;
	author: number; // CfUser
	date: string;
	title: string;
	text: string;
	public: boolean;
	pinned: boolean;
	shared: boolean;
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
	public: boolean;
	pinned: boolean;
	shared: boolean;
	relevant_student: { id: number; name: string } | null;
	updated: string; // datetime
};
