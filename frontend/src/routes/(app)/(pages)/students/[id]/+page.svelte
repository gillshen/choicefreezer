<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import { formatStudentName } from '$lib/utils/nameFormat.js';

	export let data;
	const {
		student,
		contracts,
		logs,
		enrollments,
		toeflScores,
		ieltslScores,
		detScores,
		satScores,
		actScores,
		apScores,
		greScores,
		applications
	} = data;
</script>

<h1 class="page-container">{formatStudentName(student)}</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(student, null, 2)}</pre>

	<button class="cf-secondary">Edit</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Contracts</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(contracts, null, 2)}</pre>

	<button class="cf-secondary">Add a contract</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Logs</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(logs, null, 2)}</pre>

	<button class="cf-secondary">Add an update</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Enrollments</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(enrollments, null, 2)}</pre>

	<button class="cf-secondary">Add an enrollment</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Test Scores</svelte:fragment>

	{#if toeflScores.length}
		<h3>TOEFL</h3>
		<pre class="text-surface-400">{JSON.stringify(toeflScores, null, 2)}</pre>
	{/if}

	{#if ieltslScores.length}
		<h3>IELTS</h3>
		<pre class="text-surface-400">{JSON.stringify(ieltslScores, null, 2)}</pre>
	{/if}

	{#if detScores.length}
		<h3>DET</h3>
		<pre class="text-surface-400">{JSON.stringify(detScores, null, 2)}</pre>
	{/if}

	{#if satScores.length}
		<h3>SAT</h3>
		<pre class="text-surface-400">{JSON.stringify(satScores, null, 2)}</pre>
	{/if}

	{#if actScores.length}
		<h3>ACT</h3>
		<pre class="text-surface-400">{JSON.stringify(actScores, null, 2)}</pre>
	{/if}

	{#if apScores.length}
		<h3>AP</h3>
		<pre class="text-surface-400">{JSON.stringify(apScores, null, 2)}</pre>
	{/if}

	{#if greScores.length}
		<h3>GRE</h3>
		<pre class="text-surface-400">{JSON.stringify(greScores, null, 2)}</pre>
	{/if}

	<button class="cf-secondary">Add a test</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>

	<button class="cf-primary">Add an application</button>
</PageSection>
