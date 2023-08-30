<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';

	import type { StudentListItemType } from '$lib/types/studentTypes.js';
	import type { ColumnControls } from '$lib/types/gridTypes.js';
	import { ASST_PLANNER, ESSAY_ADVISOR, PLANNER, STRAT_PLANNER } from '$lib/constants/cfRoles.js';

	import { defaultColDef, columnTypes, AgCellRenderer, mountGrid } from '$lib/utils/gridUtils.js';
	import ColumnVisibilityControl from '$lib/components/ColumnVisibilityControl.svelte';
	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';

	import { formatResidence } from '$lib/utils/studentUtils.js';
	import { toUsernamesWithRole } from '$lib/utils/serviceUtils.js';

	export let data;
	const { students } = data;

	class NameRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `../students/${params.data.id}/`;
			this.eGui.innerHTML = params.data.name;
		}
	}

	function romanizedNameValueGetter(params: ValueGetterParams): string {
		const student: StudentListItemType = params.data;
		return `${student.first_name_romanized} ${student.last_name_romanized}`.trim();
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

	const columnControls: ColumnControls = {
		name: { headerName: 'Name', hide: false },
		romanizedName: { headerName: 'Eng./Pinyin Name', hide: true },
		current: { headerName: 'Current', hide: false },
		contractType: { headerName: 'Contract Type', hide: false },
		target: { headerName: 'Target', hide: false },
		gender: { headerName: 'Gender', hide: true },
		citizenship: { headerName: 'Citizenship', hide: false },
		stratPlanner: { headerName: STRAT_PLANNER, hide: true },
		planner: { headerName: PLANNER, hide: false },
		asstPlanner: { headerName: ASST_PLANNER, hide: true },
		essayAdvisor: { headerName: ESSAY_ADVISOR, hide: false },
		born: { headerName: 'Born', hide: true },
		based: { headerName: 'Based', hide: true },
		usedCfProducts: { headerName: 'Used CF Products', hide: true },
		comments: { headerName: 'Comments', hide: false }
	};

	const columnDefs = [
		{ ...columnControls.name, field: 'name', cellRenderer: NameRenderer },
		{ ...columnControls.romanizedName, valueGetter: romanizedNameValueGetter },
		{ ...columnControls.current, field: 'is_current', cellDataType: 'boolean' },
		{ ...columnControls.contractType, field: 'latest_contract_type' },
		{ ...columnControls.target, field: 'latest_target_year', type: ['leftAlignedNumberColumn'] },
		{ ...columnControls.gender, field: 'gender' },
		{ ...columnControls.citizenship, field: 'citizenship' },
		{ ...columnControls.stratPlanner, valueGetter: usernameGetterByRole(STRAT_PLANNER) },
		{ ...columnControls.planner, valueGetter: usernameGetterByRole(PLANNER) },
		{ ...columnControls.asstPlanner, valueGetter: usernameGetterByRole(ASST_PLANNER) },
		{ ...columnControls.essayAdvisor, valueGetter: usernameGetterByRole(ESSAY_ADVISOR) },
		{ ...columnControls.born, field: 'date_of_birth', type: ['dateStringColumn'] },
		{ ...columnControls.based, valueGetter: residenceValueGetter },
		{
			...columnControls.usedCfProducts,
			cellDataType: 'boolean',
			valueGetter: usedCfProductValueGetter
		},
		{ ...columnControls.comments, field: 'comments' }
	];

	const gridOptions: GridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs,
		rowData: students,
		suppressDragLeaveHidesColumns: true
	};

	onMount(() => mountGrid('#grid', gridOptions));
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<ColumnVisibilityControl {gridOptions} initialStates={Object.values(columnControls)} />
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title flex justify-between">
			Students
			<GridDownloadButton {gridOptions} />
		</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />
	</div>
</div>
