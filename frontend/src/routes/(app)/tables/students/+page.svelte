<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Grid,
		type GridOptions,
		type ICellRendererComp,
		type ICellRendererParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import type { StudentListItemType } from '$lib/types/studentTypes.js';
	import { ASST_PLANNER, ESSAY_ADVISOR, PLANNER, STRAT_PLANNER } from '$lib/constants/cfRoles.js';
	import { formatResidence } from '$lib/utils/studentUtils.js';
	import { toUsernamesWithRole } from '$lib/utils/serviceUtils.js';

	export let data;
	const { students } = data;

	const defaultColDef = {
		sortable: true,
		resizable: true,
		flex: 1,
		minWidth: 100,
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

	function usernameGetterByRole(role: string) {
		return (params: ValueGetterParams): string => {
			const student: StudentListItemType = params.data;
			return toUsernamesWithRole(student.latest_services, role);
		};
	}

	function residenceValueGetter(params: ValueGetterParams): string {
		const student: StudentListItemType = params.data;
		return formatResidence(student);
	}

	function usedCfProductValueGetter(params: ValueGetterParams): boolean {
		const student: StudentListItemType = params.data;
		return student.cf_products.length > 0;
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
		{ headerName: 'Name', field: 'name', cellRenderer: NameRenderer },
		{ headerName: 'Is current', field: 'is_current', cellDataType: 'boolean' },
		{ headerName: 'Contract Type', field: 'latest_contract_type' },
		{ headerName: 'Target Year', field: 'latest_target_year', type: ['numberColumn'] },
		{ headerName: 'Gender', field: 'gender' },
		{ headerName: 'Citizenship', field: 'citizenship' },
		{ headerName: PLANNER, valueGetter: usernameGetterByRole(PLANNER) },
		{ headerName: ASST_PLANNER, valueGetter: usernameGetterByRole(ASST_PLANNER) },
		{ headerName: STRAT_PLANNER, valueGetter: usernameGetterByRole(STRAT_PLANNER) },
		{ headerName: ESSAY_ADVISOR, valueGetter: usernameGetterByRole(ESSAY_ADVISOR) },
		{ headerName: 'Born', field: 'date_of_birth', type: ['dateStringColumn'] },
		{ headerName: 'Based in', valueGetter: residenceValueGetter },
		{
			headerName: 'Used CF products',
			cellDataType: 'boolean',
			valueGetter: usedCfProductValueGetter
		},
		{ headerName: 'Comments', field: 'comments' }
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
