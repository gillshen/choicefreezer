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
		filter: 'agNumberColumnFilter'
	},

	dateStringColumn: {
		cellDataType: 'dateString',
		filter: 'agDateColumnFilter'
	}
};

export class AgCellRenderer implements ICellRendererComp {
	eGui!: HTMLAnchorElement;

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

export function mountGrid(elemId: string, gridOptions: GridOptions) {
	const gridEl = document.getElementById(elemId) as HTMLElement;
	new Grid(gridEl, gridOptions);
	gridOptions.api!.sizeColumnsToFit();
}

export function setColumnVisible(gridOptions: GridOptions, params: SetVisibleParams) {
	const { headerName, hide } = params;
	const columns = gridOptions.columnApi!.getColumns();
	const column = columns!.find((col) => col.getColDef().headerName === headerName);
	gridOptions.columnApi!.setColumnVisible(column!, !hide);
	gridOptions.api!.sizeColumnsToFit();
}
