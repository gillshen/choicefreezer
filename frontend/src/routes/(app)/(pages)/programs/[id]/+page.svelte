<script lang="ts">
	import { onMount } from 'svelte';
	import PageSection from '$lib/components/PageSection.svelte';

	import type { DomLayoutType } from 'ag-grid-community';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';
	import {
		ApplicationIdRenderer,
		ApplicantRenderer,
		TargetRenderer,
		StatusRenderer,
		targetValueGetter,
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
		{ headerName: 'Target', valueGetter: targetValueGetter, cellRenderer: TargetRenderer },
		{ headerName: 'Major', valueGetter: majorsValueGetter },
		{ headerName: 'Admission Plan', field: 'subtarget.admission_plan' },
		{ headerName: 'Deadline', field: 'subtarget.deadline' },
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

	$: program = data.program;

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<h1>Program {program.id}</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(program, null, 2)}</pre>
	<button class="section-cta">Edit</button>

	<!-- <svelte:fragment slot="h2">Applications</svelte:fragment> -->
	<h2 class="mt-12">Applications</h2>

	{#if data.applications.length}
		<div class={`w-full ${data.applications.length > 15 ? 'h-[calc(100vh-12rem)]' : ''}`}>
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p class="section-placeholder">{NO_ROWS_TO_SHOW}</p>
	{/if}
</PageSection>
