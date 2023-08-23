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
	filter: 'agTextColumnFilter'
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
	gridOptions.columnApi?.autoSizeAllColumns();
}
