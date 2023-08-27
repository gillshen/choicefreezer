<script lang="ts">
	import { deleteApplicationLog } from '$lib/api.js';

	import PageSection from '$lib/components/PageSection.svelte';
	import ApplicationStatusChip from '$lib/components/ApplicationStatusChip.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import ApplicationLogForm from '$lib/forms/ApplicationLogForm.svelte';
	import { toast } from '$lib/utils/interactiveUtils.js';
	import { UNKNOWN_ERROR } from '$lib/constants/messages.js';
	import { invalidateAll } from '$app/navigation';
	import OkayCancelDialog from '$lib/components/OkayCancelDialog.svelte';
	import type { ApplicationLog } from '$lib/types/applicationLogTypes.js';
	import { toShortDate } from '$lib/utils/dateUtils';
	import { statusToClass } from '$lib/utils/applicationUtils.js';

	export let data;

	const userCanEdit = true;

	let logCreationDialog: HTMLDialogElement;
	let logDeletionDialog: HTMLDialogElement;
	let activeLog: ApplicationLog;

	// TODO move to server side?
	async function handleDeleteLog() {
		const response = await deleteApplicationLog(activeLog.id);
		if (response.ok) {
			invalidateAll();
			logDeletionDialog.close();
			toast('Entry deleted', 'success');
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	$: application = data.application;
</script>

<h1>
	{application.student.name} &bullet;
	{application.schools.map((s) => s.abbreviation).join(' | ')}

	<div class="mt-8">
		<ApplicationStatusChip status={application.latest_status} />
	</div>
</h1>

<PageSection>
	<div class="grid grid-cols-2 gap-x-12 gap-y-8 auto-rows-min items-start">
		<div class="px-0 py-6 rounded-xl auto-rows-min">
			<div class="profile-grid pb-6">
				<div class="cf-key">Student</div>
				<div class="cf-value">
					<a href={`../students/${application.student.id}`}>
						{application.student.name}
					</a>
				</div>

				<div class="cf-key">
					{#if application.schools.length > 1}Schools{:else}School{/if}
				</div>
				<div class="cf-value flex flex-col">
					{#each application.schools as school}
						<a href={`../schools/${school.id}/`}>{school.name}</a>
					{/each}
				</div>

				<div class="cf-key">Program</div>
				<div class="cf-value">
					<a href={`../programs/${application.program.id}/`}>
						{application.program.display_name}
					</a>
				</div>

				<div class="cf-key">Target</div>
				<div class="cf-value">
					<a href={`../targets/${application.target.id}/`}>
						{application.target.term}
						{application.target.year}
					</a>
				</div>

				<div class="cf-key">Admission plan</div>
				<div class="cf-value">
					{application.subtarget.admission_plan}
				</div>

				<div class="cf-key">
					{#if application.major_choices.length > 1}Majors{:else}Major{/if}
				</div>
				<div class="cf-value">
					{application.major_choices.map((mc) => mc.major).join(', ') || 'n/a'}
				</div>

				<div class="cf-key">CF people</div>
				<div class="cf-value text-yellow-300">TODO</div>
			</div>

			{#if userCanEdit}
				<div class="flex gap-4">
					<button class="section-cta" on:click={() => toast('TODO', 'error')}>Edit</button>
					<button class="section-cta delete" on:click={() => toast('TODO', 'error')}>Delete</button>
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-8 auto-rows-min">
			<div class="cf-card-shadow p-4 rounded-lg">Deadline</div>
			<div class="cf-card-shadow p-4 rounded-lg">Decision date</div>
			<div class="cf-card-shadow p-4 rounded-lg">SAT / ACT / GRE / GMAT 1</div>
			<div class="cf-card-shadow p-4 rounded-lg">SAT / ACT / GRE / GMAT 2</div>
			<div class="cf-card-shadow p-4 rounded-lg">TOEFL / IELTS</div>
			<div class="cf-card-shadow p-4 rounded-lg">Scholarship</div>
			<div class="cf-card-shadow p-4 rounded-lg col-span-2 font-mono">#if alt_admitted_into</div>
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Timeline</svelte:fragment>

	{#if application.logs.length}
		<div class="pl-2 max-w-prose">
			<ol class="relative border-l border-surface-400">
				{#each data.application.logs as log}
					<li class="mb-10 ml-4">
						<div
							class={`absolute app-status-dot w-4 h-4 mt-[38px] -left-2 ${statusToClass(
								log.status
							)}`}
						/>
						<time class="mb-1 text-sm leading-none text-surface-300">{toShortDate(log.date)}</time>

						<h3 class="py-2 text-lg text-surface-50 flex gap-4 items-baseline">
							{log.status}
							<small class="text-surface-500">Updated {toShortDate(log.updated)}</small>

							{#if userCanEdit}
								<div class="flex">
									<button
										class="icon-button text-surface-300"
										on:click={() => toast('todo', 'error')}
									>
										<i class="fa-solid fa-pen" />
									</button>
									<button
										class="icon-button delete text-surface-300"
										on:click={() => {
											activeLog = log;
											logDeletionDialog.showModal();
										}}
									>
										<i class="fa-solid fa-trash" />
									</button>
								</div>
							{/if}
						</h3>

						{#each log.comments.split(/\n+/g) as paragraph}
							<p class="mb-4 max-w-prose text-surface-300">
								{paragraph}
							</p>
						{/each}
					</li>
				{/each}
			</ol>
		</div>
	{:else}
		<p class="section-placeholder">No data</p>
	{/if}

	<button class="section-cta" on:click={() => logCreationDialog.showModal()}>Add an entry</button>
</PageSection>

<Dialog exitHelper bind:dialog={logCreationDialog}>
	<ApplicationLogForm
		dialog={logCreationDialog}
		data={data.logCreationForm}
		action="?/createLog"
		applicationId={application.id}
	/>
</Dialog>

<OkayCancelDialog
	title="Delete this entry?"
	bind:dialog={logDeletionDialog}
	onOkay={handleDeleteLog}
	okayButtonText="Yes"
	cancelButtonText="No"
	dangerous
>
	{#if activeLog}
		<p>{activeLog.status} - {toShortDate(activeLog.date)}</p>
	{/if}
</OkayCancelDialog>
