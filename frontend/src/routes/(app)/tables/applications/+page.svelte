<script lang="ts">
	import { Grid, type GridOptions, type ValueGetterParams } from 'ag-grid-community';

	import { defaultColDef, columnTypes } from '$lib/utils/gridUtils.js';
	import type { ApplicationListItem } from '$lib/types/applicationTypes.js';
	import { onMount } from 'svelte';

	export let data;
	const { applications } = data;

	function schoolAbbreviationsValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.schools.map((s) => s.abbreviation).join(' | ');
	}

	function majorsValueGetter(params: ValueGetterParams): string {
		const application: ApplicationListItem = params.data;
		return application.majors_list.join('; ');
	}

	const columnDefs = [
		{ headerName: 'Student', field: 'student.name' },
		{ headerName: 'School', valueGetter: schoolAbbreviationsValueGetter },
		{ headerName: 'Program', field: 'program.display_name' },
		{ headerName: 'Majors', valueGetter: majorsValueGetter },
		{ headerName: 'Year', field: 'target.year', type: ['numberColumn'] },
		{ headerName: 'Term', field: 'target.term' },
		{ headerName: 'Admission Plan', field: 'subtarget.admission_plan' },
		// TODO include timezone
		{ headerName: 'Deadline', field: 'subtarget.deadline' },
		{ headerName: 'Decision Date', field: 'subtarget.decision_date' },
		{ headerName: 'Latest Status', field: 'latest_log.status' }
	];

	const gridOptions: GridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs,
		rowData: applications
	};

	function exportToCsv() {
		gridOptions.api?.exportDataAsCsv();
	}

	onMount(() => {
		const gridEl = document.getElementById('grid') as HTMLElement;
		new Grid(gridEl, gridOptions);
		gridOptions.columnApi?.autoSizeAllColumns();
	});
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<pre>{JSON.stringify(applications, null, 2)}</pre>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">Applications</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />

		<button class="grid-page-export" on:click={exportToCsv}>Export to CSV</button>
	</div>
</div>
