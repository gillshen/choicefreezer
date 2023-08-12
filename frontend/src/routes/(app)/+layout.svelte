<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">(icon)</svelte:fragment>
	<nav class="flex gap-6 flex-wrap">
		<a href="../home">Home</a>
		<!-- TODO implement [CF People], [Explore] and [About]; remove the rest -->
		<button>CF People</button>
		<button>Explore</button>
		<a href="../tables/students">Students</a>
		<a href="../tables/applications">Apps</a>
		<a href="../tables/programs">Programs</a>
		<a href="../about">About</a>
	</nav>
	<svelte:fragment slot="trail">
		<div class="flex flex-wrap gap-2">
			<button class="btn hover:variant-outline-primary">Settings</button>
			<button class="btn variant-outline hover:variant-outline-primary">Log Out</button>
		</div>
	</svelte:fragment>
</AppBar>

<main>
	<slot />
</main>

<footer class="bg-surface-800 p-6">
	<div class="max-w-5xl mx-auto">(footer)</div>
</footer>

<style>
</style>
