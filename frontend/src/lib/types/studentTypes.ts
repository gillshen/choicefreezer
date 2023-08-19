import type { GENDERS } from '$lib/constants/genders';
import type { ContractType } from '$lib/types/contractTypes';

type Gender = (typeof GENDERS)[number];

export type StudentListItemType = {
	id: number;
	cf_products: Array<{
		id: number;
		name: string;
	}>;
	name: string;
	is_current: boolean;
	latest_target_year: number;
	latest_contract_type: ContractType;
	latest_services: Array<{
		id: number;
		cf_username: string;
		role: string;
		start_date: string | null; // date
		end_date: string | null; // date
		contract: number; // id
		cf_person: number; // id
	}>;
	last_name: string;
	first_name: string;
	last_name_first: boolean;
	last_name_romanized: string;
	first_name_romanized: string;
	gender: Gender;
	citizenship: string;
	date_of_birth: string | null; // date
	city: string;
	state: string;
	comments: string;
};
