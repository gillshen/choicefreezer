<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';

	export let data;
	const { program, applications } = data;
</script>

<h1 class="page-container">Program {program.id}</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(program, null, 2)}</pre>
	<button class="cf-secondary">Edit</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>
</PageSection>