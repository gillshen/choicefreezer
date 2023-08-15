<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';

	export let data;
	const { application, logs } = data;
</script>

<h1>Application {application.id}</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(application, null, 2)}</pre>
	<button class="cf-secondary">Edit</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Updates</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(logs, null, 2)}</pre>

	<button class="cf-primary">Add an update</button>
</PageSection>
