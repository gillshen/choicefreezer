import type { ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import type { School, Target } from '$lib/types/programTypes';
import { AgCellRenderer } from '$lib/utils/gridUtils';
import { byYearDesc } from '$lib/utils/sortUtils';

export class LinkRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('a');
		this.eGui.href = `../programs/${params.data.id}/`;
		this.eGui.innerHTML = '<i class="fa-solid fa-arrow-right" />';
	}
}

export class SchoolsRenderer extends AgCellRenderer {
	declare eGui: HTMLElement;

	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('div');
		const schoolLinks = [];

		for (const school of params.data.schools) {
			schoolLinks.push(`<a href="../schools/${school.id}">${school.name}</a>`);
		}

		this.eGui.innerHTML = schoolLinks.join(' | ');
	}
}

export class TargetsRenderer extends AgCellRenderer {
	declare eGui: HTMLElement;

	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('div');
		const targetLinks = [];

		for (const target of params.data.targets.sort(byYearDesc)) {
			targetLinks.push(`<a href="../targets/${target.id}">${target.term} ${target.year}</a>`);
		}

		this.eGui.innerHTML = targetLinks.join(', ');
	}
}

export function schoolsValueGetter(params: ValueGetterParams): string {
	const schools: School[] = params.data.schools;
	return schools.map((school) => school.name).join(' | ');
}

export function targetsValueGetter(params: ValueGetterParams): string {
	const targets: Target[] = params.data.targets;
	return targets
		.sort(byYearDesc)
		.map((target) => `${target.term} ${target.year}`)
		.join(', ');
}
