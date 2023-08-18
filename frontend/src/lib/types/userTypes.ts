export type UserListItem = {
	readonly id: number;
	readonly username: string;
	readonly department: string;
	readonly is_active: boolean;
};

export type StudentOfUser = {
	id: number;
	name: string;
	last_name_romanized: string;
	first_name_romanized: string;
	latest_target_year: number;
	latest_contract_type: string;
};

// Returned by cf/<username>
export type User = {
	id: number;
	username: string;
	email: string;
	is_active: boolean;
	department: string;
	public_banner: string;
	private_banner: string;
	current_students: StudentOfUser[];
	past_students: StudentOfUser[];
	applications: any[];
};
