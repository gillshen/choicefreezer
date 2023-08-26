<script lang="ts">
	import { onMount } from 'svelte';
	import PageSection from '$lib/components/PageSection.svelte';

	import type { DomLayoutType } from 'ag-grid-community';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';
	import {
		ApplicantRenderer,
		ApplicationIdRenderer,
		StatusRenderer,
		majorsValueGetter
	} from '$lib/utils/applicationGridUtils.js';
	import { NO_ROWS_YET } from '$lib/constants/messages.js';

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
		{ headerName: 'Deadline', field: 'subtarget.deadline' },
		{ headerName: 'Decision Date', field: 'subtarget.decision_date' },
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

	onMount(() => mountGrid('applications-grid', gridOptions));
</script>

<h1>Target {target.id}</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(target, null, 2)}</pre>
	<button class="section-cta">Edit</button>

	<h2 class="mt-12">Deadlines</h2>
	<pre class="text-surface-400">{JSON.stringify(data.subTargets, null, 2)}</pre>

	<button class="section-cta">Add a deadline</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Requirements</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(data.requirements, null, 2)}</pre>

	<button class="section-cta">Edit</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>

	{#if data.applications.length}
		<div class={`w-full ${data.applications.length > 15 ? 'h-[calc(100vh-12rem)]' : ''}`}>
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p>{NO_ROWS_YET}</p>
	{/if}
</PageSection>
