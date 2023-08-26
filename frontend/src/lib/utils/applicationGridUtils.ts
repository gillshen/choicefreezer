import type { ICellRendererParams, ValueGetterParams } from 'ag-grid-community';
import type { ApplicationListItem } from '$lib/types/applicationTypes';
import { AgCellRenderer } from '$lib/utils/gridUtils';
import { statusToClass } from '$lib/utils/applicationUtils';

export class ApplicationIdRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('a');
		this.eGui.href = `../applications/${params.data.id}/`;
		this.eGui.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square" />';
	}
}

export class ApplicantRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('a');
		this.eGui.href = `../students/${params.data.student.id}/`;
		this.eGui.innerText = params.data.student.name;
	}
}

export class ProgramRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		const { program } = params.data;
		this.eGui = document.createElement('a');
		this.eGui.href = `../programs/${program.id}/`;
		this.eGui.innerText = program.display_name;
	}
}

export class TargetRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		const { target } = params.data;
		this.eGui = document.createElement('a');
		this.eGui.href = `../targets/${target.id}/`;
		this.eGui.innerText = `${target.term} ${target.year}`;
	}
}

export class StatusRenderer extends AgCellRenderer {
	declare eGui: HTMLDivElement;

	init(params: ICellRendererParams<any, any, any>): void {
		const { latest_log } = params.data;
		this.eGui = document.createElement('div');

		if (!latest_log) {
			this.eGui.innerHTML = '';
			return;
		}
		this.eGui.classList.add('flex', 'gap-2', 'items-center');

		const statusDot = document.createElement('div');
		statusDot.classList.add('app-status-dot', statusToClass(latest_log.status));
		this.eGui.appendChild(statusDot);

		const statusText = document.createElement('div');
		statusText.classList.add('app-status-dot-text');
		statusText.innerText = latest_log.status;
		this.eGui.appendChild(statusText);
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
