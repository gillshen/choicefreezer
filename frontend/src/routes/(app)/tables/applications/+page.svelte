<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';

	import { defaultColDef, columnTypes, AgCellRenderer, mountGrid } from '$lib/utils/gridUtils.js';
	import type { ApplicationListItem } from '$lib/types/applicationTypes.js';
	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';

	export let data;
	const { applications } = data;

	class IdRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `../applications/${params.data.id}/`;
			this.eGui.title = 'Go to the application page';
			this.eGui.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square" />';
		}
	}

	class ProgramRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			const { program } = params.data;
			this.eGui = document.createElement('a');
			this.eGui.href = `../programs/${program.id}/`;
			this.eGui.title = 'Go to the program page';
			this.eGui.innerText = program.display_name;
		}
	}

	class TargetRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			const { target } = params.data;
			this.eGui = document.createElement('a');
			this.eGui.href = `../targets/${target.id}/`;
			this.eGui.title = 'Go to the target page';
			this.eGui.innerText = `${target.term} ${target.year}`;
		}
	}

	function schoolValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.schools.map((s) => s.name).join(' | ');
	}

	function schoolAbbreviationsValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.schools.map((s) => s.abbreviation).join(' | ');
	}

	function targetValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return `${application.target.term} ${application.target.year}`;
	}

	function majorsValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.majors_list.join('; ');
	}

	const columnDefs = [
		{
			headerName: '',
			field: 'id',
			type: ['numberColumn'],
			filter: false,
			sortable: false,
			width: 50,
			minWidth: 50,
			cellRenderer: IdRenderer
		},
		{ headerName: 'Student', field: 'student.name' },
		{ headerName: 'School', valueGetter: schoolValueGetter },
		{ headerName: 'School Abbr.', valueGetter: schoolAbbreviationsValueGetter },
		{ headerName: 'Program', field: 'program.display_name', cellRenderer: ProgramRenderer },
		{ headerName: 'Major', valueGetter: majorsValueGetter },
		// { headerName: 'Year', field: 'target.year', type: ['numberColumn'] },
		// { headerName: 'Term', field: 'target.term' },
		{ headerName: 'Target', valueGetter: targetValueGetter, cellRenderer: TargetRenderer },
		{ headerName: 'Admission Plan', field: 'subtarget.admission_plan' },
		// TODO include timezone
		{ headerName: 'Deadline', field: 'subtarget.deadline' },
		{ headerName: 'Decision Date', field: 'subtarget.decision_date' },
		{ headerName: 'Latest Status', field: 'latest_log.status' },
		{ headerName: 'Status Updated', field: 'latest_log.updated' },
		{ headerName: 'SAT', field: 'submitting_sat', cellDataType: 'boolean' },
		{ headerName: 'ACT', field: 'submitting_act', cellDataType: 'boolean' },
		{ headerName: 'GRE', field: 'submitting_gre', cellDataType: 'boolean' },
		{ headerName: 'GMAT', field: 'submitting_gmat', cellDataType: 'boolean' },
		{ headerName: 'TOEFL', field: 'submitting_toefl', cellDataType: 'boolean' },
		{ headerName: 'IELTS', field: 'submitting_ielts', cellDataType: 'boolean' },
		{ headerName: 'DET', field: 'submitting_det', cellDataType: 'boolean' }
	];

	const gridOptions: GridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs,
		rowData: applications
	};

	onMount(() => mountGrid('grid', gridOptions));
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<pre>{JSON.stringify(applications, null, 2)}</pre>
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">Applications</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />

		<GridDownloadButton {gridOptions} />
	</div>
</div>
