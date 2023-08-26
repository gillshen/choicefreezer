<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions } from 'ag-grid-community';

	import type { ColumnControls } from '$lib/types/gridTypes.js';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';

	import {
		ApplicationIdRenderer,
		ApplicantRenderer,
		ProgramRenderer,
		TargetRenderer,
		StatusRenderer,
		schoolValueGetter,
		schoolAbbreviationsValueGetter,
		targetValueGetter,
		majorsValueGetter
	} from '$lib/utils/applicationGridUtils.js';

	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';
	import ColumnVisibilityControl from '$lib/components/ColumnVisibilityControl.svelte';

	export let data;
	const { applications } = data;

	const columnControls: ColumnControls = {
		link: { headerName: 'Link', hide: false },
		student: { headerName: 'Student', hide: false },
		target: { headerName: 'Target', hide: false },
		school: { headerName: 'School', hide: true },
		schoolAbbr: { headerName: 'School Abbr.', hide: false },
		program: { headerName: 'Program', hide: false },
		major: { headerName: 'Major', hide: false },
		admissionPlan: { headerName: 'Admission Plan', hide: false },
		deadline: { headerName: 'Deadline', hide: false },
		decisionDate: { headerName: 'Decision Date', hide: true },
		satScore: { headerName: 'SAT', hide: true },
		actScore: { headerName: 'ACT', hide: true },
		greScore: { headerName: 'GRE', hide: true },
		gmatScore: { headerName: 'GMAT', hide: true },
		toeflScore: { headerName: 'TOEFL', hide: true },
		ieltsScore: { headerName: 'IELTS', hide: true },
		detScore: { headerName: 'DET', hide: true },
		latestStatus: { headerName: 'Latest Status', hide: false },
		statusUpdated: { headerName: 'Status Updated', hide: false }
	};

	const columnDefs = [
		{
			...columnControls.link,
			field: 'id',
			flex: 0,
			maxWidth: 80,
			filter: false,
			sortable: false,
			minWidth: 50,
			cellRenderer: ApplicationIdRenderer
		},
		{ ...columnControls.student, field: 'student.name', cellRenderer: ApplicantRenderer },
		{ ...columnControls.target, valueGetter: targetValueGetter, cellRenderer: TargetRenderer },

		{ ...columnControls.school, valueGetter: schoolValueGetter },
		{ ...columnControls.schoolAbbr, valueGetter: schoolAbbreviationsValueGetter },
		{ ...columnControls.program, field: 'program.display_name', cellRenderer: ProgramRenderer },
		{ ...columnControls.major, valueGetter: majorsValueGetter },

		{ ...columnControls.admissionPlan, field: 'subtarget.admission_plan' },
		// TODO include timezone
		{ ...columnControls.deadline, field: 'subtarget.deadline' },
		{ ...columnControls.decisionDate, field: 'subtarget.decision_date' },

		{ ...columnControls.satScore, field: 'submitting_sat', cellDataType: 'boolean' },
		{ ...columnControls.actScore, field: 'submitting_act', cellDataType: 'boolean' },
		{ ...columnControls.greScore, field: 'submitting_gre', cellDataType: 'boolean' },
		{ ...columnControls.gmatScore, field: 'submitting_gmat', cellDataType: 'boolean' },
		{ ...columnControls.toeflScore, field: 'submitting_toefl', cellDataType: 'boolean' },
		{ ...columnControls.ieltsScore, field: 'submitting_ielts', cellDataType: 'boolean' },
		{ ...columnControls.detScore, field: 'submitting_det', cellDataType: 'boolean' },

		{ ...columnControls.latestStatus, field: 'latest_log.status', cellRenderer: StatusRenderer },
		{ ...columnControls.statusUpdated, field: 'latest_log.updated' }
	];

	const gridOptions: GridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs,
		rowData: applications,
		suppressDragLeaveHidesColumns: true
	};

	onMount(() => mountGrid('grid', gridOptions));
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<ColumnVisibilityControl {gridOptions} initialStates={Object.values(columnControls)} />
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title flex justify-between">
			Applications
			<GridDownloadButton {gridOptions} />
		</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />
	</div>
</div>
