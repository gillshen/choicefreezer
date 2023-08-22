<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';

	export let data;

	$: application = data.application;

	const userCanEdit = true;
</script>

<h1>
	{application.student.name} &bullet;
	{application.schools.map((s) => s.abbreviation).join(' | ')}
</h1>

<PageSection>
	<div class="profile-grid">
		<div class="cf-key">Student</div>
		<div>{application.student.name}</div>

		<div class="cf-key">
			{#if application.schools.length > 1}Schools{:else}School{/if}
		</div>
		<div class="cf-value">{application.schools.map((s) => s.name).join(' | ')}</div>

		<div class="cf-key">Program</div>
		<div class="cf-value">{application.program.display_name}</div>

		<div class="cf-key">
			{#if application.major_choices.length > 1}Majors{:else}Major{/if}
		</div>
		<div class="cf-value">
			{application.major_choices.map((mc) => mc.major).join(', ')}
			{#if userCanEdit}
				<button>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Target</div>
		<div class="cf-value">{application.target.term} {application.target.year}</div>

		<div class="cf-key">Admission plan</div>
		<div class="cf-value">
			{application.subtarget.admission_plan}
			{#if userCanEdit}
				<button>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Deadline</div>
		<div class="cf-value">
			{application.subtarget.deadline ?? 'n/a'}
			{application.subtarget.deadline_timezone}
			{#if userCanEdit}
				<button>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Decision date</div>
		<div class="cf-value">
			{application.subtarget.decision_date ?? 'n/a'}
			{#if userCanEdit}
				<button>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Latest status</div>
		<div class="cf-value">
			<!-- TODO style the chip -->
			<div class="status-chip">
				{application.latest_status ?? 'n/a'}
			</div>
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Timeline</svelte:fragment>
	{#if application.logs.length}
		<pre class="text-surface-400 bg-surface-700 mb-4">{JSON.stringify(
				application.logs,
				null,
				2
			)}</pre>
	{/if}

	<button class="cf-primary">Add an entry</button>
</PageSection>

<PageSection>
	<pre class="text-surface-400 bg-surface-700">{JSON.stringify(application, null, 2)}</pre>
</PageSection>

<style lang="postcss">
	.status-chip {
		@apply px-4 py-1 min-w-[10rem];
		@apply text-center;
		@apply rounded-full;
		@apply text-surface-900;
		@apply bg-surface-50;
	}
</style>
