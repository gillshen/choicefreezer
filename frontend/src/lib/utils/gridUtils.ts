import type { SetVisibleParams } from '$lib/types/gridTypes';
import {
	Grid,
	type GridOptions,
	type ICellRendererComp,
	type ICellRendererParams
} from 'ag-grid-community';

export const defaultColDef = {
	sortable: true,
	resizable: true,
	flex: 1,
	minWidth: 100,
	maxWidth: 500,
	filter: 'agTextColumnFilter',
	floatingFilter: true
};

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

	dateStringColumn: {
		cellDataType: 'dateString',
		filter: 'agDateColumnFilter'
	}
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
