<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';

	export let data;
	const { user, students, applications } = data;
</script>

<h1>
	{user.public_banner || `${user.username}\u2019s Mojo Dojo Casa House`}
</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(user, null, 2)}</pre>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Students</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(students, null, 2)}</pre>

	<button class="cf-primary">Add a student</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>
</PageSection>
