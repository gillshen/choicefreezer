<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';

	import { defaultColDef, columnTypes, AgCellRenderer, mountGrid } from '$lib/utils/gridUtils.js';
	import type { StudentListItemType } from '$lib/types/studentTypes.js';
	import { ASST_PLANNER, ESSAY_ADVISOR, PLANNER, STRAT_PLANNER } from '$lib/constants/cfRoles.js';
	import { formatResidence } from '$lib/utils/studentUtils.js';
	import { toUsernamesWithRole } from '$lib/utils/serviceUtils.js';
	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';

	export let data;
	const { students } = data;

	class NameRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `../students/${params.data.id}/`;
			this.eGui.title = 'Go to the student page';
			this.eGui.innerHTML = params.data.name;
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
		{ headerName: 'Current', field: 'is_current', cellDataType: 'boolean' },
		{ headerName: 'Contract Type', field: 'latest_contract_type' },
		{ headerName: 'Target Year', field: 'latest_target_year', type: ['numberColumn'] },
		{ headerName: 'Gender', field: 'gender' },
		{ headerName: 'Citizenship', field: 'citizenship' },
		{ headerName: PLANNER, valueGetter: usernameGetterByRole(PLANNER) },
		{ headerName: ASST_PLANNER, valueGetter: usernameGetterByRole(ASST_PLANNER) },
		{ headerName: STRAT_PLANNER, valueGetter: usernameGetterByRole(STRAT_PLANNER) },
		{ headerName: ESSAY_ADVISOR, valueGetter: usernameGetterByRole(ESSAY_ADVISOR) },
		{ headerName: 'Born', field: 'date_of_birth', type: ['dateStringColumn'] },
		{ headerName: 'Based', valueGetter: residenceValueGetter },
		{
			headerName: 'Used CF Products',
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

	onMount(() => mountGrid('grid', gridOptions));
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<pre>{JSON.stringify(students[0], null, 2)}</pre>
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">Students</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />

		<GridDownloadButton {gridOptions} />
	</div>
</div>
