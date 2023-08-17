<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import StudentAnchorCard from '$lib/components/StudentAnchorCard.svelte';
	import { sortByRomanizedName, sortByTargetYearDesc } from '$lib/utils/studentUtils.js';

	export let data;
	const { user, applications } = data;

	let filterYear: number | null = null;

	$: currentStudents =
		filterYear === null
			? user.current_students
			: user.current_students.filter((s) => s.latest_target_year === filterYear);
</script>

<h1>
	{user.public_banner || `${user.username}\u2019s Mojo Dojo Casa House`}
</h1>

<PageSection>
	<!-- TODO buttons for filtering by year -->
	<h3 class="mb-4">Current students</h3>

	<div class="flex flex-wrap gap-4 mb-4">
		{#each currentStudents.sort(sortByRomanizedName) as student}
			<StudentAnchorCard {student} />
		{/each}
		<StudentAnchorCard />
	</div>

	<!-- TODO change to a button -->
	<h3 class="mb-4 mt-8">Past students</h3>

	<div class="flex flex-wrap gap-4">
		{#each user.past_students.sort(sortByRomanizedName).sort(sortByTargetYearDesc) as student}
			<StudentAnchorCard {student} />
		{/each}
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Raw</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(user, null, 2)}</pre>
</PageSection>
