<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import MinimalRadioGroup from '$lib/components/MinimalRadioGroup.svelte';
	import StudentAnchorCard from '$lib/components/StudentAnchorCard.svelte';
	import { byContractType, byRomanizedName, byTargetYearDesc } from '$lib/utils/studentUtils.js';

	export let data;
	const { user, applications } = data;

	const banner = user.public_banner || `${user.username}\u2019s Mojo Dojo Casa House`;

	// Filtering by latest_target_year values

	// - options for current students
	const yearOptionsCurrent: number[] = Array.from(
		new Set(user.current_students.map((s) => s.latest_target_year))
	).sort((a, b) => b - a);

	// - options for past students
	const yearOptionsPast: number[] = Array.from(
		new Set(user.past_students.map((s) => s.latest_target_year))
	).sort((a, b) => b - a);

	let filterYearCurrent: number | string = 'All';
	let filterYearPast: number | string = 'All';

	$: filteredCurrentStudents =
		filterYearCurrent === 'All'
			? user.current_students
			: user.current_students.filter((s) => s.latest_target_year === filterYearCurrent);

	$: filteredPastStudents =
		filterYearPast === 'All'
			? user.past_students
			: user.past_students.filter((s) => s.latest_target_year === filterYearPast);

	let showPastStudents = false;
</script>

<h1>{banner}</h1>

<PageSection>
	<h2 class="mb-4">Current students</h2>

	<div class="student-grid">
		<MinimalRadioGroup bind:target={filterYearCurrent} options={['All', ...yearOptionsCurrent]} />

		<div class="student-cards-container">
			{#each filteredCurrentStudents
				.sort(byRomanizedName)
				.sort(byTargetYearDesc)
				.sort(byContractType) as student}
				<StudentAnchorCard {student} />
			{/each}
			<StudentAnchorCard />
		</div>
	</div>

	<button
		class="mt-8 hover:text-primary-500"
		on:click={() => (showPastStudents = !showPastStudents)}
	>
		<h3 class="px-0 py-2 m-0">
			Past students <i
				class={`toggle-icon fa-solid fa-chevron-down ${showPastStudents ? 'open' : ''}`}
			/>
		</h3>
	</button>

	<div id="past-students-wrapper" class={showPastStudents ? 'open' : ''}>
		<div class="student-grid">
			<MinimalRadioGroup bind:target={filterYearPast} options={['All', ...yearOptionsPast]} />

			<div class="student-cards-container">
				{#each filteredPastStudents
					.sort(byRomanizedName)
					.sort(byTargetYearDesc)
					.sort(byContractType) as student}
					<StudentAnchorCard {student} />
				{/each}
			</div>
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>
</PageSection>

<style lang="postcss">
	.student-grid {
		@apply grid grid-cols-[1fr,_4fr] gap-x-16;
	}
	.student-cards-container {
		@apply flex flex-wrap gap-6;
		@apply h-fit;
	}
	#past-students-wrapper {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		opacity: 0;
		transition: all 0.4s ease-in-out;
	}
	#past-students-wrapper.open {
		grid-template-rows: 1fr;
		opacity: 1;
	}
	#past-students-wrapper * {
		min-height: 0;
	}
	.toggle-icon {
		transition: all 0.4s ease-in-out;
	}
	.toggle-icon.open {
		rotate: 180deg;
	}
</style>
