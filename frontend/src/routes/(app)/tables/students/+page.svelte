<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Grid,
		type GridOptions,
		type ICellRendererComp,
		type ICellRendererParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import { formatResidence } from '$lib/utils/studentUtils.js';

	export let data;
	const { students } = data;

	const defaultColDef = {
		sortable: true,
		resizable: true,
		flex: 1,
		minWidth: 50,
		maxWidth: 500,
		filter: 'agTextColumnFilter'
	};

	class NameRenderer implements ICellRendererComp {
		eGui!: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `../students/${params.data.id}/`;
			this.eGui.innerHTML = params.data.name;
		}

		getGui(): HTMLElement {
			return this.eGui;
		}

		refresh(): boolean {
			return false;
		}
	}

	function residenceValueGetter(params: ValueGetterParams): string {
		return formatResidence(params.data);
	}

	// TODO should be returned from the backend
	function isCurrentValueGetter(params: ValueGetterParams): boolean {
		return params.data.contracts.filter((c: any) => c.status === 'Effective').length > 0;
	}
	// TODO should be returned from the backend
	function targetYearValueGetter(params: ValueGetterParams): number {
		return Math.max(...params.data.contracts.map((c: any) => c.target_year));
	}

	const columnTypes = {
		numberColumn: {
			cellDataType: 'number',
			filter: 'agNumberColumnFilter'
		},
		dateStringColumn: {
			cellDataType: 'dateString',
			filter: 'agDateColumnFilter'
		}
	};

	const columnDefs = [
		{ field: 'name', cellRenderer: NameRenderer },
		{ headerName: 'Is current', cellDataType: 'boolean', valueGetter: isCurrentValueGetter },
		{ headerName: 'Target', type: ['numberColumn'], valueGetter: targetYearValueGetter },
		{ field: 'gender' },
		{ field: 'citizenship' },
		{ field: 'date_of_birth', headerName: 'Born', type: ['dateStringColumn'] },
		{ headerName: 'Based in', valueGetter: residenceValueGetter },
		{ field: 'comments' }
		// TODO current_staff fields
	];

	const gridOptions: GridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs,
		rowData: students
	};

	function exportToCsv() {
		gridOptions.api?.exportDataAsCsv();
	}

	onMount(() => {
		// Render the grid
		const gridEl = document.getElementById('grid') as HTMLElement;
		new Grid(gridEl, gridOptions);
		gridOptions.columnApi?.autoSizeAllColumns();
	});
</script>

<h1 class="max-w-6xl px-8">Students</h1>

<div class="h-full max-w-6xl mx-auto p-8 flex flex-col gap-8">
	<div id="grid" class="data-grid ag-theme-alpine-dark" />

	<button class="cf-primary max-w-fit" on:click={exportToCsv}>Export to CSV</button>

	{#if students.length}
		<pre class="text-surface-400">{JSON.stringify(students[0], null, 2)}</pre>
	{/if}
</div>
