import type { ContractType } from '$lib/types/contractTypes';

export function typeToClass(status: ContractType) {
	return status.replace(/ /g, '-').toLocaleLowerCase();
}
