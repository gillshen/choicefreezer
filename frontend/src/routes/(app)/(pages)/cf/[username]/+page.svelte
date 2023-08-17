<script lang="ts">
	import MinimalRadioGroup from '$lib/components/MinimalRadioGroup.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import StudentAnchorCard from '$lib/components/StudentAnchorCard.svelte';
	import { sortByRomanizedName, sortByTargetYearDesc } from '$lib/utils/studentUtils.js';

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
</script>

<h1>{banner}</h1>

<PageSection>
	<h3 class="mb-4">Current students</h3>

	<div class="student-grid">
		<MinimalRadioGroup bind:target={filterYearCurrent} options={['All', ...yearOptionsCurrent]} />

		<div class="student-cards-container">
			{#each filteredCurrentStudents
				.sort(sortByRomanizedName)
				.sort(sortByTargetYearDesc) as student}
				<StudentAnchorCard {student} />
			{/each}
			<StudentAnchorCard />
		</div>
	</div>

	<!-- TODO change to a button? -->
	<h3 class="mb-4 mt-8">Past students</h3>

	<div class="student-grid">
		<MinimalRadioGroup bind:target={filterYearPast} options={['All', ...yearOptionsPast]} />

		<div class="student-cards-container">
			{#each filteredPastStudents.sort(sortByRomanizedName).sort(sortByTargetYearDesc) as student}
				<StudentAnchorCard {student} />
			{/each}
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
		@apply flex flex-wrap gap-4;
		@apply h-fit;
	}
</style>
