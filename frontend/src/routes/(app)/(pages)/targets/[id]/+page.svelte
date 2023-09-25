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
	import { byDeadline } from '$lib/utils/sortUtils.js';
	import { formatTimezone, toShortDateWithoutYear, toTime, toYear } from '$lib/utils/dateUtils.js';

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

	$: target = data.target;

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

	<div class="grid grid-cols-3 gap-12 h-full max-h-[960px] items-start">
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
			<div class="flex flex-col gap-6">
				{#each target.subtargets.sort(byDeadline) as subtarget}
					{@const { deadline_date, deadline_time, deadline_timezone, decision_date } = subtarget}

					<div class="subtarget-card">
						<div class="flex justify-between items-center py-2">
							<div class="font-heading-token font-bold text-sm">{subtarget.admission_plan}</div>
							<div class="subtarget-actions flex">
								<EditIconButton classNames="text-primary-400 hover:text-primary-500" />
								<!-- <DeleteIconButton classNames="text-error-400 hover:text-error-500" /> -->
							</div>
						</div>

						<div class="grid grid-cols-2 gap-4">
							<div class="flex px-3 py-3 bg-yellow-400/90 text-surface-900 rounded-lg">
								<i class="fa-solid fa-calendar-days mt-1" />

								{#if deadline_date}
									<div class="flex flex-col gap-2 ml-4">
										<div class="text-xl font-bold">
											{toShortDateWithoutYear(deadline_date)}, {toYear(deadline_date)}
										</div>
										{#if deadline_time}
											<div class="text-sm">
												{toTime(deadline_time)}
												{#if deadline_timezone}{formatTimezone(deadline_timezone)}{/if}
											</div>
										{/if}
									</div>
								{:else}
									<div class="no-date">?</div>
								{/if}
							</div>

							<div class="flex px-3 py-3 bg-surface-700/50 text-surface-200 rounded-lg">
								<i class="fa-solid fa-bell mt-1 text-primary-400 float-left" />

								{#if decision_date}
									<div class="ml-4 text-lg">
										{toShortDateWithoutYear(decision_date)}, {toYear(decision_date)}
									</div>
								{:else}
									<div class="no-date">?</div>
								{/if}
							</div>
						</div>

						{#if subtarget.comments}
							<div class="mx-4 pt-2 border-t border-surface-600">{subtarget.comments}</div>
						{/if}
					</div>
				{/each}
				<button class="btn cf-btn cf-secondary max-w-fit">Add an admission plan</button>
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

<style lang="postcss">
	.cf-entry-label {
		@apply mb-1;
	}

	.link-card {
		@apply p-4 w-full min-h-[80px];
		@apply bg-surface-700;
		@apply rounded-md;
		@apply flex gap-2 items-center;
	}
	.link-card i {
		@apply text-primary-400;
	}
	.link-card:hover {
		@apply bg-surface-600 text-primary-400;
	}

	.subtarget-card {
		@apply border-t border-yellow-400/40;
		@apply mb-4;
	}
	.subtarget-actions {
		@apply opacity-0;
		@apply transition-opacity duration-200;
	}
	.subtarget-card:hover .subtarget-actions {
		@apply opacity-100;
	}

	.no-date {
		@apply flex w-full h-full -ml-[14px];
		@apply justify-center items-center text-2xl font-bold;
	}
</style>
