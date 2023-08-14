<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">(icon) ChoiceFreezer</svelte:fragment>
	<nav class="flex gap-6 flex-wrap">
		<a href="../home">Home</a>
		<!-- TODO implement [People], [Tables] and [About]; remove the rest -->
		<button>People</button>
		<button>Tables</button>
		<a href="../tables/students">Students</a>
		<a href="../tables/applications">Apps</a>
		<a href="../tables/programs">Programs</a>
		<a href="../about">About</a>
	</nav>
	<svelte:fragment slot="trail">
		<div class="flex flex-wrap flex-shrink gap-2">
			<button class="btn hover:variant-filled-secondary">Settings</button>
			<button class="cf-secondary">Log Out</button>
		</div>
	</svelte:fragment>
</AppBar>

<main>
	<slot />
</main>

<footer>
	<div class="max-w-5xl mx-auto">(footer)</div>
</footer>
