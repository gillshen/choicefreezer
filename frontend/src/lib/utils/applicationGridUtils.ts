import type { ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import type { ApplicationListItem } from '$lib/types/applicationTypes';
import { AgCellRenderer } from '$lib/utils/gridUtils';

export class ApplicationIdRenderer extends AgCellRenderer {
	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('a');
		this.eGui.href = `../applications/${params.data.id}/`;
		this.eGui.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square" />';
	}
}

export class ApplicantRenderer extends AgCellRenderer {
	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('a');
		this.eGui.href = `../students/${params.data.student.id}/`;
		this.eGui.innerText = params.data.student.name;
	}
}

export class ProgramRenderer extends AgCellRenderer {
	init(params: ICellRendererParams<any, any, any>): void {
		const { program } = params.data;
		this.eGui = document.createElement('a');
		this.eGui.href = `../programs/${program.id}/`;
		this.eGui.innerText = program.display_name;
	}
}

export class TargetRenderer extends AgCellRenderer {
	init(params: ICellRendererParams<any, any, any>): void {
		const { target } = params.data;
		this.eGui = document.createElement('a');
		this.eGui.href = `../targets/${target.id}/`;
		this.eGui.innerText = `${target.term} ${target.year}`;
	}
}

export function schoolValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return application.schools.map((s) => s.name).join(' | ');
}

export function schoolAbbreviationsValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return application.schools.map((s) => s.abbreviation).join(' | ');
}

export function targetValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return `${application.target.term} ${application.target.year}`;
}

export function majorsValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return application.majors_list.join('; ');
}
