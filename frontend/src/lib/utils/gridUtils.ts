import type { Application } from '$lib/types/gridNestedItemTypes';
import type { SetVisibleParams } from '$lib/types/gridTypes';
import {
	Grid,
	type GridOptions,
	type ICellRendererComp,
	type ICellRendererParams,
	type ValueFormatterParams,
	type ValueGetterParams
} from 'ag-grid-community';

import { toShortDate } from '$lib/utils/dateUtils';

export const defaultColDef = {
	sortable: true,
	resizable: true,
	flex: 1,
	minWidth: 100,
	maxWidth: 500,
	filter: 'agTextColumnFilter',
	floatingFilter: true
};

export class AgCellRenderer implements ICellRendererComp {
	eGui!: HTMLElement;

	init(params: ICellRendererParams<any, any, any>): void {
		console.log(params);
	}

	getGui(): HTMLElement {
		return this.eGui;
	}

	refresh(): boolean {
		return false;
	}
}

export function mountGrid(selector: string, gridOptions: GridOptions) {
	const gridEl = document.querySelector(selector);
	if (!gridEl) {
		return;
	}
	new Grid(gridEl as HTMLElement, gridOptions);
	gridOptions.api!.sizeColumnsToFit();
}

export function setColumnVisible(gridOptions: GridOptions, params: SetVisibleParams) {
	const { headerName, hide } = params;
	const columns = gridOptions.columnApi!.getColumns();
	const column = columns!.find((col) => col.getColDef().headerName === headerName);
	gridOptions.columnApi!.setColumnVisible(column!, !hide);
	gridOptions.api!.sizeColumnsToFit();
}

export function noZeroFormatter(params: ValueFormatterParams): string {
	return params.value ? params.value : '';
}

export function percentageFormatter(params: ValueFormatterParams): string {
	if (params.value === null) {
		return '';
	}
	return Intl.NumberFormat('default', {
		style: 'percent',
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	}).format(params.value);
}

export function shortDateFormatter(params: ValueFormatterParams): string {
	if (!params.value) {
		return '';
	}
	return toShortDate(params.value);
}

function numberAppliedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_submitted).length;
}

function numberResultPendingValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.general_status === 'result pending').length;
}

function numberDeferredValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_deferred).length;
}

function numberWaitlistedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_waitlisted).length;
}

function numberAdmittedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_admitted).length;
}

export function numberDeferAdmittedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_deferred && app.was_admitted).length;
}

function numberWaitlistAdmittedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_waitlisted && app.was_admitted).length;
}

function numberRejectedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_rejected).length;
}

function numberDeferRejectedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_deferred && app.was_rejected).length;
}

function numberWaitlistedRejectedValueGetter(params: ValueGetterParams): number {
	const applications: Application[] = params.data.applications;
	return applications.filter((app) => app.was_waitlisted && app.was_rejected).length;
}

function admitRateValueGetter(params: ValueGetterParams): number | null {
	const applications: Application[] = params.data.applications;
	const applied = applications.filter((app) => app.was_submitted).length;
	if (!applied) {
		return null;
	}
	const admitted = applications.filter((app) => app.was_admitted).length;
	return admitted / applied;
}

export const columnTypes = {
	numberColumn: {
		cellDataType: 'number',
		filter: 'agNumberColumnFilter',
		headerClass: 'ag-right-aligned-header',
		cellClass: 'ag-right-aligned-cell'
	},

	leftAlignedNumberColumn: {
		cellDataType: 'number',
		filter: 'agNumberColumnFilter'
	},

	falsySuppressedColumn: {
		valueFormatter: noZeroFormatter
	},

	dateStringColumn: {
		cellDataType: 'dateString',
		filter: 'agDateColumnFilter'
	},

	// Columns common to the school and program grids
	numberApplied: {
		valueGetter: numberAppliedValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberResultPending: {
		valueGetter: numberResultPendingValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberAdmitted: {
		valueGetter: numberAdmittedValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberDeferAdmitted: {
		valueGetter: numberDeferAdmittedValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberWaitlistAdmitted: {
		valueGetter: numberWaitlistAdmittedValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberRejected: {
		valueGetter: numberRejectedValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberDeferRejected: {
		valueGetter: numberDeferRejectedValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberWaitlistRejected: {
		valueGetter: numberWaitlistedRejectedValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberDeferred: {
		valueGetter: numberDeferredValueGetter,
		valueFormatter: noZeroFormatter
	},
	numberWaitlisted: {
		valueGetter: numberWaitlistedValueGetter,
		valueFormatter: noZeroFormatter
	},
	admitRate: {
		valueGetter: admitRateValueGetter,
		valueFormatter: percentageFormatter
	}
};
