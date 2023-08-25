<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions, ICellRendererParams, ValueGetterParams } from 'ag-grid-community';

	import type { ApplicationListItem } from '$lib/types/applicationTypes.js';
	import type { ColumnControls } from '$lib/types/gridTypes.js';

	import { defaultColDef, columnTypes, AgCellRenderer, mountGrid } from '$lib/utils/gridUtils.js';
	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';
	import ColumnVisibilityControl from '$lib/components/ColumnVisibilityControl.svelte';

	export let data;
	const { applications } = data;

	class IdRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `../applications/${params.data.id}/`;
			this.eGui.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square" />';
		}
	}

	class StudentRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `../students/${params.data.student.id}/`;
			this.eGui.innerText = params.data.student.name;
		}
	}

	class ProgramRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			const { program } = params.data;
			this.eGui = document.createElement('a');
			this.eGui.href = `../programs/${program.id}/`;
			this.eGui.innerText = program.display_name;
		}
	}

	class TargetRenderer extends AgCellRenderer {
		init(params: ICellRendererParams<any, any, any>): void {
			const { target } = params.data;
			this.eGui = document.createElement('a');
			this.eGui.href = `../targets/${target.id}/`;
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

	const columnControls: ColumnControls = {
		link: { headerName: 'Link', hide: false },
		student: { headerName: 'Student', hide: false },
		school: { headerName: 'School', hide: true },
		schoolAbbr: { headerName: 'School Abbr.', hide: false },
		program: { headerName: 'Program', hide: false },
		major: { headerName: 'Major', hide: false },
		target: { headerName: 'Target', hide: false },
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
			filter: false,
			sortable: false,
			minWidth: 50,
			cellRenderer: IdRenderer
		},
		{ ...columnControls.student, field: 'student.name', cellRenderer: StudentRenderer },
		{ ...columnControls.school, valueGetter: schoolValueGetter },
		{ ...columnControls.schoolAbbr, valueGetter: schoolAbbreviationsValueGetter },
		{ ...columnControls.program, field: 'program.display_name', cellRenderer: ProgramRenderer },
		{ ...columnControls.major, valueGetter: majorsValueGetter },

		{ ...columnControls.target, valueGetter: targetValueGetter, cellRenderer: TargetRenderer },
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

		{ ...columnControls.latestStatus, field: 'latest_log.status' },
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
