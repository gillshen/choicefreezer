import type { ContractType } from '$lib/types/contractTypes';

export function typeToClass(contractType: ContractType): string {
	return contractType.replace(/ /g, '-').toLocaleLowerCase();
}

export function typeToInitial(contractType: ContractType): string {
	switch (contractType) {
		case 'UG Freshman':
			return 'U';
		case 'UG Transfer':
			return 'T';
		case 'Graduate':
			return 'G';
	}
}
