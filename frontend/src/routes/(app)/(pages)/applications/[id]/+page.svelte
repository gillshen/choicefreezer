<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	import { deleteApplication, deleteApplicationLog } from '$lib/api.js';
	import type { ApplicationLog } from '$lib/types/applicationLogTypes.js';

	import Section from '$lib/components/Section.svelte';
	import ApplicationStatusChip from '$lib/components/ApplicationStatusChip.svelte';
	import DateTimeDisplay from '$lib/components/DateTimeDisplay.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import ApplicationUpdateForm from '$lib/forms/ApplicationUpdateForm.svelte';
	import DeadlineUpdateForm from '$lib/forms/DeadlineUpdateForm.svelte';
	import DecisionDateUpdateForm from '$lib/forms/DecisionDateUpdateForm.svelte';
	import ApplicationLogForm from '$lib/forms/ApplicationLogForm.svelte';
	import BinaryDialog from '$lib/components/BinaryDialog.svelte';
	import EditIconButton from '$lib/components/EditIconButton.svelte';
	import DeleteIconButton from '$lib/components/DeleteIconButton.svelte';

	import { toast } from '$lib/utils/interactiveUtils.js';
	import { UNKNOWN_ERROR } from '$lib/constants/messages.js';
	import { toShortDate } from '$lib/utils/dateUtils';
	import { getBestScore, statusToClass } from '$lib/utils/applicationUtils.js';
	import { isGraduate, isUndergraduate } from '$lib/utils/programUtils.js';

	export let data;

	const userIsOwner = true;

	let applicationUpdateDialog: HTMLDialogElement;
	let applicationDeleteDialog: HTMLDialogElement;

	// TODO move to server side?
	async function handleDeleteApplication() {
		const response = await deleteApplication(application.id);
		if (response.ok) {
			applicationDeleteDialog.close();
			toast('Application deleted. Redirecting...', 'success');
			setTimeout(() => goto(`../students/${application.student.id}/`), 2000);
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	let deadlineUpdateDialog: HTMLDialogElement;
	let decisionDateUpdateDialog: HTMLDialogElement;

	let logCreateDialog: HTMLDialogElement;
	let logDeleteDialog: HTMLDialogElement;
	let activeLog: ApplicationLog;

	// TODO move to server side?
	async function handleDeleteLog() {
		const response = await deleteApplicationLog(activeLog.id);
		if (response.ok) {
			invalidateAll();
			logDeleteDialog.close();
			toast('Entry deleted', 'success');
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	$: application = data.application;
</script>

<Section hero>
	<h1 class="cf-h1">
		<span class="mr-6">
			{application.student.name} &bullet;
			{application.schools.map((s) => s.abbreviation).join(' | ')}
		</span>
		<div>
			<ApplicationStatusChip status={application.latest_status} />
		</div>
	</h1>

	<div class="grid grid-cols-3 gap-12 h-full max-h-[960px] items-start">
		<article class="panel !grid grid-cols-[1fr_2fr] gap-8 col-span-2">
			<!-- Student info -->
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="flex gap-2 items-baseline pb-4">
					<span class="text-xl font-bold">
						{application.student.name}
					</span>
					<a href={`../students/${application.student.id}`} class="cf-page-link text-base">
						<i class="fa-solid fa-arrow-right" />
					</a>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">GPA</div>
					<div class="score">(TODO)</div>
				</div>

				{#if application.sat_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">SAT</div>
						<div class="score">
							{getBestScore(application.sat_submitted)}
						</div>
					</div>
				{/if}

				{#if application.act_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">ACT</div>
						<div class="score">
							{getBestScore(application.act_submitted)}
						</div>
					</div>
				{/if}

				<!-- If UG without tests, show an emty SAT/ACT card -->
				{#if isUndergraduate(application.program.type) && !application.sat_submitted.length && !application.act_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">SAT / ACT</div>
						<div>Not submitted</div>
					</div>
				{/if}

				{#if application.gre_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">GRE</div>
						<div class="score">
							{getBestScore(application.gre_submitted)}
						</div>
					</div>
				{/if}

				{#if application.gmat_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">GMAT</div>
						<div class="score">
							{getBestScore(application.gmat_submitted)}
						</div>
					</div>
				{/if}

				<!-- If grad without tests, show an empty GRE/GMAT card -->
				{#if isGraduate(application.program.type) && !application.gre_submitted.length && !application.gmat_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">GRE / GMAT</div>
						<div>Not submitted</div>
					</div>
				{/if}

				{#if application.toefl_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">TOEFL</div>
						<div class="score">
							{getBestScore(application.toefl_submitted)}
						</div>
					</div>
				{/if}

				{#if application.ielts_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">IELTS</div>
						<div class="score">
							{getBestScore(application.ielts_submitted)}
						</div>
					</div>
				{/if}

				{#if application.det_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">DET</div>
						<div class="score">
							{getBestScore(application.det_submitted)}
						</div>
					</div>
				{/if}

				<!-- If without english proficiency results -->
				{#if !application.toefl_submitted.length && !application.ielts_submitted.length && !application.det_submitted.length}
					<div class="cf-entry">
						<div class="cf-entry-label">English proficiency</div>
						<div>Not submitted</div>
					</div>
				{/if}

				{#if userIsOwner}
					<footer class="flex gap-6 mt-auto">
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-primary-400 hover:text-primary-500"
							on:click={() => applicationUpdateDialog.showModal()}>Edit</button
						>
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-error-400 hover:text-error-500"
							on:click={() => applicationDeleteDialog.showModal()}>Delete</button
						>
					</footer>
				{/if}
			</div>

			<!-- Target info -->
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="flex flex-col gap-2 pb-4">
					{#each application.schools as school}
						<div class="flex gap-2 items-baseline">
							<span class="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis"
								>{school.name}</span
							><a href={`../schools/${school.id}/`} class="cf-page-link text-base"
								><i class="fa-solid fa-arrow-right" /></a
							>
						</div>
					{/each}
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Program</div>
					<a href={`../programs/${application.program.id}/`} class="cf-page-link">
						{application.program.display_name}
					</a>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Admission plan</div>
					<div class="flex gap-1">
						<a href={`../targets/${application.target.id}/`} class="cf-page-link">
							{application.target.term}
							{application.target.year}
						</a>
						<span class="text-surface-400 border-r mx-1 border-surface-500" />
						{application.subtarget.admission_plan}
					</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label mb-1">
						{#if application.major_choices.length > 1}Majors{:else}Major{/if}
					</div>
					{#if application.major_choices.length > 1}
						<div class="flex gap-1">
							{#each application.major_choices as majorChoice, index}
								{#if index}
									<span class="text-surface-400 border-r mx-1 border-surface-500" />
								{/if}
								<span>{majorChoice.major}</span>
							{/each}
						</div>
					{:else}
						n/a
					{/if}
				</div>

				<!-- TODO -->
				<!-- <div class="cf-entry">
					<div class="cf-entry-label">CF team</div>
				</div> -->

				<div class="cf-entry">
					<div class="cf-entry-label">Status</div>
					{#if application.alt_admitted_into}
						Admitted to <a
							href={`/targets/${application.alt_admitted_into.id}/`}
							class="cf-page-link">{application.alt_admitted_into.program_display_name}</a
						>
					{:else}
						{application.latest_status ?? 'n/a'}
					{/if}
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Scholarship awarded</div>
					{#if application.scholarship_amount}
						{new Intl.NumberFormat('en-US').format(application.scholarship_amount)}
						{application.scholarship_currency}
					{:else}
						None
					{/if}
				</div>
			</div>
		</article>

		<!-- Dates -->
		<article class="panel transparent gap-8">
			<div class="date-card-background deadline">
				<div class="date-card">
					<header class="flex justify-between items-center">
						<div class="text-surface-300">Deadline</div>
						{#if userIsOwner}
							<div class="date-card-actions">
								<EditIconButton
									onClick={() => deadlineUpdateDialog.showModal()}
									classNames="text-primary-400 hover:text-primary-500"
								/>
							</div>
						{/if}
					</header>

					<DateTimeDisplay
						date={application.subtarget.deadline_date}
						time={application.subtarget.deadline_time}
						timezone={application.subtarget.deadline_timezone}
					/>
				</div>
			</div>

			<div class="date-card-background decision-date">
				<div class="date-card">
					<header class="flex justify-between items-center">
						<div class="text-surface-300">Decision date</div>
						{#if userIsOwner}
							<div class="date-card-actions">
								<EditIconButton
									onClick={() => decisionDateUpdateDialog.showModal()}
									classNames="text-primary-400 hover:text-primary-500"
								/>
							</div>
						{/if}
					</header>

					<DateTimeDisplay date={application.subtarget.decision_date} />
				</div>
			</div>
		</article>
	</div>
</Section>

<Section>
	<h2 class="text-xl font-heading-token font-bold mb-8">Timeline</h2>

	{#if application.logs.length}
		<div class="pl-2 max-w-prose">
			<ol class="relative border-l border-zinc-600">
				{#each data.application.logs as log}
					<li class="mb-10 ml-4">
						<div
							class={`absolute app-status-dot w-4 h-4 mt-[37px] -left-2 ${statusToClass(
								log.status
							)}`}
						/>
						<time class="mb-1 text-sm leading-none text-tertiary-400">{toShortDate(log.date)}</time>

						<div class="py-2 flex gap-4 items-baseline">
							<span class="font-heading-token">{log.status}</span>
							<small class="text-surface-400">Updated {toShortDate(log.updated)}</small>

							{#if userIsOwner}
								<DeleteIconButton
									onClick={() => {
										activeLog = log;
										logDeleteDialog.showModal();
									}}
									classNames="text-surface-400 hover:text-error-500 translate-y-[1px]"
								/>
							{/if}
						</div>

						{#each log.comments.split(/(?:\r?\n)+/g) as paragraph}
							<p class="mb-4 max-w-prose text-surface-300">
								{paragraph}
							</p>
						{/each}
					</li>
				{/each}
			</ol>
		</div>
	{/if}

	<button class="btn cf-btn cf-secondary" on:click={() => logCreateDialog.showModal()}
		>Add an entry</button
	>
</Section>

<Dialog exitHelper bind:dialog={applicationUpdateDialog}>
	<ApplicationUpdateForm
		bind:dialog={applicationUpdateDialog}
		action="?/updateApplication"
		data={data.applicationUpdateForm}
		programType={application.program.type}
	/>
</Dialog>

<BinaryDialog
	title="Delete this application?"
	bind:dialog={applicationDeleteDialog}
	onYes={handleDeleteApplication}
	dangerous
/>

<Dialog exitHelper bind:dialog={deadlineUpdateDialog}>
	<DeadlineUpdateForm
		bind:dialog={deadlineUpdateDialog}
		action="?/updateDeadline"
		data={data.deadlineUpdateForm}
		admissionPlan={application.subtarget.admission_plan}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={decisionDateUpdateDialog}>
	<DecisionDateUpdateForm
		bind:dialog={decisionDateUpdateDialog}
		action="?/updateDecisionDate"
		data={data.decisionDateUpdateForm}
		admissionPlan={application.subtarget.admission_plan}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={logCreateDialog}>
	<ApplicationLogForm
		dialog={logCreateDialog}
		data={data.logCreationForm}
		action="?/createLog"
		applicationId={application.id}
	/>
</Dialog>

<BinaryDialog
	title="Delete this entry?"
	bind:dialog={logDeleteDialog}
	onYes={handleDeleteLog}
	dangerous
>
	{#if activeLog}
		<p>{activeLog.status} - {toShortDate(activeLog.date)}</p>
	{/if}
</BinaryDialog>

<style lang="postcss">
	.cf-entry-label {
		@apply mb-1;
	}

	.date-card-background,
	.date-card {
		@apply aspect-square;
		@apply rounded-lg;
	}
	.date-card-background {
		@apply w-[180px] h-[180px];
		@apply flex justify-center items-center;
	}

	.date-card-background.deadline {
		background-image: linear-gradient(163deg, rgb(234, 179, 8) 0%, #84cc16 100%);
	}
	.date-card-background.decision-date {
		background-image: linear-gradient(163deg, rgb(6, 212, 184) 0%, rgb(59, 75, 246) 100%);
	}

	.date-card {
		@apply p-4;
		@apply flex flex-col;
		@apply w-[178px] h-[178px];
		@apply bg-surface-800;
	}

	.date-card-actions {
		@apply opacity-0;
		@apply transition-opacity duration-200;
	}
	.date-card:hover .date-card-actions {
		@apply opacity-100;
	}
</style>
