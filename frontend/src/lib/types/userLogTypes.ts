export type UserLog = {
	id: number;
	author: number; // CfUser
	title: string;
	text: string;
	public: boolean;
	pinned: boolean;
	shared: boolean;
	relevant_student: number | null; // Student
	updated: string; // datetime
};

export type NewUserLog = Omit<UserLog, 'id' | 'updated'>;
