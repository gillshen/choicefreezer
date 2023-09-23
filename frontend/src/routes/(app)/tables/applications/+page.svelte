<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions } from 'ag-grid-community';

	import type { ColumnControls } from '$lib/types/gridTypes.js';
	import {
		defaultColDef,
		columnTypes,
		mountGrid,
		shortDateFormatter
	} from '$lib/utils/gridUtils.js';

	import {
		ApplicationIdRenderer,
		ApplicantRenderer,
		ProgramRenderer,
		TargetRenderer,
		StatusRenderer,
		schoolValueGetter,
		schoolAbbreviationsValueGetter,
		targetValueGetter,
		majorsValueGetter,
		deadlineValueGetter,
		deadlineValueFormatter,
		decisionDateValueGetter,
		actBestScoreGetter,
		satBestScoreGetter,
		apValueGetter,
		greBestScoreGetter,
		gmatBestScoreGetter,
		toeflBestScoreGetter,
		ieltsBestScoreGetter,
		detBestScoreGetter,
		statusUpdatedValueGetter,
		ibPredictedValueGetter,
		ibFinalValueGetter,
		alevelPredictedValueGetter,
		alevelFinalValueGetter,
		lsatBestScoreGetter
	} from '$lib/utils/applicationGridUtils.js';

	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';
	import ColumnVisibilityControl from '$lib/components/ColumnVisibilityControl.svelte';
	import Section from '$lib/components/Section.svelte';

	export let data;
	const { applications } = data;

	const columnControls: ColumnControls = {
		link: { headerName: 'Link', hide: false },
		student: { headerName: 'Student', hide: false },
		target: { headerName: 'Target', hide: false },
		school: { headerName: 'School', hide: true },
		schoolAbbr: { headerName: 'School Abbr.', hide: false },
		program: { headerName: 'Program', hide: false },
		major: { headerName: 'Major', hide: true },
		admissionPlan: { headerName: 'Admission Plan', hide: false },
		deadline: { headerName: 'Deadline', hide: false },
		decisionDate: { headerName: 'Decision Date', hide: true },
		satScore: { headerName: 'SAT', hide: true },
		actScore: { headerName: 'ACT', hide: true },
		apScores: { headerName: 'AP', hide: true },
		ibPredictedGrades: { headerName: 'IB Predicted', hide: true },
		ibFinalGrades: { headerName: 'IB Final', hide: true },
		alevelPredictedGrades: { headerName: 'A Level Predicted', hide: true },
		alevelFinalGrades: { headerName: 'A Level Final', hide: true },
		greScore: { headerName: 'GRE', hide: true },
		gmatScore: { headerName: 'GMAT', hide: true },
		lsatScore: { headerName: 'LSAT', hide: true },
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
		{
			...columnControls.deadline,
			type: ['dateStringColumn'],
			valueGetter: deadlineValueGetter,
			valueFormatter: deadlineValueFormatter
		},
		{
			...columnControls.decisionDate,
			field: 'subtarget.decision_date',
			type: ['dateStringColumn'],
			valueGetter: decisionDateValueGetter,
			valueFormatter: shortDateFormatter
		},

		{ ...columnControls.satScore, type: ['numberColumn'], valueGetter: satBestScoreGetter },
		{ ...columnControls.actScore, type: ['numberColumn'], valueGetter: actBestScoreGetter },

		{ ...columnControls.apScores, valueGetter: apValueGetter },
		{ ...columnControls.ibPredictedGrades, valueGetter: ibPredictedValueGetter },
		{ ...columnControls.ibFinalGrades, valueGetter: ibFinalValueGetter },
		{ ...columnControls.alevelPredictedGrades, valueGetter: alevelPredictedValueGetter },
		{ ...columnControls.alevelFinalGrades, valueGetter: alevelFinalValueGetter },

		{ ...columnControls.greScore, type: ['numberColumn'], valueGetter: greBestScoreGetter },
		{ ...columnControls.gmatScore, type: ['numberColumn'], valueGetter: gmatBestScoreGetter },
		{ ...columnControls.lsatScore, type: ['numberColumn'], valueGetter: lsatBestScoreGetter },

		{ ...columnControls.toeflScore, type: ['numberColumn'], valueGetter: toeflBestScoreGetter },
		{ ...columnControls.ieltsScore, type: ['numberColumn'], valueGetter: ieltsBestScoreGetter },
		{ ...columnControls.detScore, type: ['numberColumn'], valueGetter: detBestScoreGetter },

		{ ...columnControls.latestStatus, field: 'latest_log.status', cellRenderer: StatusRenderer },
		{
			...columnControls.statusUpdated,
			field: 'latest_log.date',
			type: ['dateStringColumn'],
			valueGetter: statusUpdatedValueGetter,
			valueFormatter: shortDateFormatter
		}
	];

	const gridOptions: GridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs,
		rowData: applications,
		suppressDragLeaveHidesColumns: true
	};

	onMount(() => mountGrid('#grid', gridOptions));
</script>

<Section hero wide classNames="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<ColumnVisibilityControl {gridOptions} initialStates={Object.values(columnControls)} />
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">
			Applications
			<GridDownloadButton {gridOptions} />
		</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />
	</div>
</Section>
