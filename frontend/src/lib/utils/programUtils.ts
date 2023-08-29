import type { ProgramType } from '$lib/types/programTypes';

export function isUndergraduate(programType: ProgramType): boolean {
	return ['UG Freshman', 'UG Transfer'].includes(programType);
}

export function isGraduate(programType: ProgramType): boolean {
	return ['Master', 'Doctorate'].includes(programType);
}
