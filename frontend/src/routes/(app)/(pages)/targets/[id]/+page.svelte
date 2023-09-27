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
	import { NONE_AT_THE_MOMENT } from '$lib/constants/messages.js';

	import EditIconButton from '$lib/components/EditIconButton.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import CfRankForm from '$lib/forms/CfRankForm.svelte';
	import SubTargetCard from '$lib/components/SubTargetCard.svelte';
	import SubTargetForm from '$lib/forms/SubTargetForm.svelte';
	import { byDeadline } from '$lib/utils/sortUtils.js';

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

	let rankUpdateDialog: HTMLDialogElement;
	let subTargetCreateDialog: HTMLDialogElement;

	$: target = data.target;
	$: subTargets = target.subtargets.sort(byDeadline);

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<Section hero>
	<h1 class="cf-h1 flex">
		<span class="px-2 py-1 rounded-md text-sm bg-surface-200 text-surface-800"
			>{target.term} {target.year}</span
		>
		<span class="px-2">{target.program_display_name}</span>
		<span>@</span>
		<span class="pl-2">{target.schools.map((s) => s.abbreviation).join(' & ')}</span>
	</h1>

	<div class="grid grid-cols-[1fr_2fr] gap-20 h-full max-h-[960px] items-start">
		<article class="panel">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="flex flex-col gap-4 pb-4">
					{#each target.schools as school}
						<a href={`/schools/${school.id}`} class="link-card">
							<span class="font-bold">{school.name}</span>
							<i class="fa-solid fa-arrow-right" />
						</a>
					{/each}
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Program</div>
					<a href={`/programs/${target.program.id}`} class="cf-page-link">
						{target.program_display_name}
					</a>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Term</div>
					{target.term}
					{target.year}
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">CF rank</div>
					<div class="my-auto flex justify-between">
						<span>{target.cf_rank ?? 'n/a'}</span>
						<EditIconButton
							onClick={() => rankUpdateDialog.showModal()}
							classNames="text-primary-400 hover:text-primary-500"
						/>
					</div>
				</div>
			</div>
		</article>

		<article class="panel transparent">
			<div class="grid grid-cols-3 gap-8">
				{#each subTargets as subTarget}
					<SubTargetCard {subTarget} targetId={target.id} programType={target.program.type} />
				{/each}
				<button
					class="btn cf-btn cf-secondary w-[200px] col-span-3 mb-8"
					on:click={() => subTargetCreateDialog.showModal()}>Add an admission plan</button
				>
			</div>
		</article>
	</div>
</Section>

<Section>
	<h2 class="text-xl font-heading-token font-bold mb-8">Applications</h2>

	{#if data.applications.length}
		<div class={`w-full ${data.applications.length > 15 ? 'h-[calc(100vh-12rem)]' : ''}`}>
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p class="section-placeholder">{NONE_AT_THE_MOMENT}</p>
	{/if}
</Section>

<Section lighter>
	<h2 class="text-xl font-heading-token font-bold mb-8">Requirements</h2>
	<pre class="text-surface-400">{JSON.stringify(data.requirements, null, 2)}</pre>

	<button class="btn cf-btn cf-secondary">Edit</button>
</Section>

<Dialog bind:dialog={rankUpdateDialog} exitHelper>
	<CfRankForm
		bind:dialog={rankUpdateDialog}
		data={data.rankUpdateForm}
		action="?/updateCfRank"
		targetId={target.id}
	/>
</Dialog>

<Dialog bind:dialog={subTargetCreateDialog} exitHelper title="Add an admission plan">
	<SubTargetForm
		bind:dialog={subTargetCreateDialog}
		data={data.subTargetCreateForm}
		action="?/createSubTarget"
		targetId={target.id}
		programType={target.program.type}
	/>
</Dialog>

<style lang="postcss">
	.cf-entry-label {
		@apply mb-1;
	}
</style>
