<script lang="ts">
	import { onMount } from 'svelte';
	import Section from '$lib/components/Section.svelte';

	import type { DomLayoutType } from 'ag-grid-community';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';
	import { shortDateFormatter } from '$lib/utils/gridUtils.js';
	import {
		ApplicantRenderer,
		ApplicationIdRenderer,
		StatusRenderer,
		deadlineValueFormatter,
		deadlineValueGetter,
		decisionDateValueGetter,
		majorsValueGetter
	} from '$lib/utils/applicationGridUtils.js';
	import { NO_ROWS_TO_SHOW } from '$lib/constants/messages.js';

	export let data;

	const applicationColumnDefs = [
		{
			headerName: 'Link',
			field: 'id',
			flex: 0,
			maxWidth: 80,
			filter: false,
			sortable: false,
			minWidth: 50,
			cellRenderer: ApplicationIdRenderer
		},
		{ headerName: 'Student', field: 'student.name', cellRenderer: ApplicantRenderer },
		{ headerName: 'Major', valueGetter: majorsValueGetter },
		{ headerName: 'Admission Plan', field: 'subtarget.admission_plan' },
		{
			headerName: 'Deadline',
			type: ['dateStringColumn'],
			valueGetter: deadlineValueGetter,
			valueFormatter: deadlineValueFormatter
		},
		{
			headerName: 'Decision Date',
			field: 'subtarget.decision_date',
			type: ['dateStringColumn'],
			valueGetter: decisionDateValueGetter,
			valueFormatter: shortDateFormatter
		},
		{ headerName: 'Status', field: 'latest_log.status', cellRenderer: StatusRenderer }
	];

	const gridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs: applicationColumnDefs,
		rowData: data.applications,
		suppressDragLeaveHidesColumns: true,
		domLayout: data.applications.length > 15 ? undefined : ('autoHeight' as DomLayoutType)
	};

	$: target = data.target;

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<Section hero>
	<h1 class="cf-h1">Target {target.id}</h1>

	<pre class="text-surface-400">{JSON.stringify(target, null, 2)}</pre>

	<h2 class="mt-12">Deadlines</h2>
	<pre class="text-surface-400">{JSON.stringify(data.subTargets, null, 2)}</pre>

	<button class="btn cf-btn cf-secondary">Add a deadline</button>
</Section>

<Section>
	<h2>Requirements</h2>
	<pre class="text-surface-400">{JSON.stringify(data.requirements, null, 2)}</pre>

	<button class="btn cf-btn cf-secondary">Edit</button>
</Section>

<Section>
	<h2>Applications</h2>

	{#if data.applications.length}
		<div class={`w-full ${data.applications.length > 15 ? 'h-[calc(100vh-12rem)]' : ''}`}>
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p class="section-placeholder">{NO_ROWS_TO_SHOW}</p>
	{/if}
</Section>
