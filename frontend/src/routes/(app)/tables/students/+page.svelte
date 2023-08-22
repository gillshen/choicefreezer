<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Grid,
		type GridOptions,
		type ICellRendererComp,
		type ICellRendererParams,
		type ValueGetterParams
	} from 'ag-grid-community';

	import { defaultColDef, columnTypes } from '$lib/utils/gridUtils.js';
	import type { StudentListItemType } from '$lib/types/studentTypes.js';
	import { ASST_PLANNER, ESSAY_ADVISOR, PLANNER, STRAT_PLANNER } from '$lib/constants/cfRoles.js';
	import { formatResidence } from '$lib/utils/studentUtils.js';
	import { toUsernamesWithRole } from '$lib/utils/serviceUtils.js';

	export let data;
	const { students } = data;

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

	const columnDefs = [
		{ headerName: 'Name', field: 'name', cellRenderer: NameRenderer },
		{ headerName: 'Contract in effect', field: 'is_current', cellDataType: 'boolean' },
		{ headerName: 'Contract type', field: 'latest_contract_type' },
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

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<pre>{JSON.stringify(students[0], null, 2)}</pre>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">Students</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />

		<button class="grid-page-export" on:click={exportToCsv}>Export to CSV</button>
	</div>
</div>
