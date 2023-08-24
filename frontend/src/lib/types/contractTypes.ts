import type { CONTRACT_TYPES } from '$lib/constants/contractTypes';
import type { CONTRACT_STATUSES } from '$lib/constants/contractStatuses';
import type { CF_ROLES } from '$lib/constants/cfRoles';

export type ServiceRole = (typeof CF_ROLES)[number];

export type Service = {
	id: number;
	contract: number;
	cf_person: number;
	cf_username: string;
	role: ServiceRole;
	start_date: string | null;
	end_date: string | null;
};

export type ContractType = (typeof CONTRACT_TYPES)[number];

export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export type ContractListItem = {
	id: number;
	student: number;
	type: ContractType;
	target_year: number;
	date_signed: string | null;
	student_progression_at_signing: string;
	status: ContractStatus;
	services: Service[];
};

export type ContractPageData = {
	id: number;
	student: {
		id: number;
		name: string;
	};
	type: ContractType;
	target_year: number;
	date_signed: string | null;
	student_progression_at_signing: string;
	status: ContractStatus;
	services: Service[];
};
