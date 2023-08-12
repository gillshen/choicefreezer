<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';

	export let data;
	const { userProfile, students, applications } = data;
</script>

<h1 class="page-container">User {userProfile.user}</h1>

<PageSection>
	<pre class="text-surface-400">{JSON.stringify(userProfile, null, 2)}</pre>
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
