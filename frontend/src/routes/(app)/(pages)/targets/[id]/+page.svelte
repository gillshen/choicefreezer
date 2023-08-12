<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';

	export let data;
	const { target, subTargets, requirements, applications } = data;
</script>

<h1 class="page-container">Target {target.id}</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(target, null, 2)}</pre>
	<button class="cf-secondary">Edit</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Deadlines</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(subTargets, null, 2)}</pre>

	<button class="cf-secondary">Add a deadline</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Requirements</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(requirements, null, 2)}</pre>

	<button class="cf-secondary">Edit</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>
</PageSection>
