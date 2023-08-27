<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import ApplicationStatusChip from '$lib/components/ApplicationStatusChip.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import ApplicationLogForm from '$lib/forms/ApplicationLogForm.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { toast } from '$lib/utils/interactiveUtils.js';

	export let data;

	const userCanEdit = true;

	let logCreationDialog: HTMLDialogElement;

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
			<Timeline logs={application.logs}>
				{#if userCanEdit}
					<div class="flex">
						<button class="icon-button text-surface-300" on:click={() => toast('Todo', 'error')}>
							<i class="fa-solid fa-pen" />
						</button>
						<button
							class="icon-button delete text-surface-300"
							on:click={() => toast('Entry deleted', 'success')}
						>
							<i class="fa-solid fa-trash" />
						</button>
					</div>
				{/if}
			</Timeline>
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
