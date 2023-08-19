<script lang="ts">
	import CfPeopleNav from '$lib/components/CfPeopleNav.svelte';
	import { filterForActive } from '$lib/utils/userUtils.js';
	import { AppBar } from '@skeletonlabs/skeleton';

	export let data;
	const { cfPeople } = data;

	const activePeople = filterForActive(cfPeople);
</script>

<AppBar slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">(icon) ChoiceFreezer</svelte:fragment>
	<nav class="flex gap-8 flex-wrap">
		<a href="../home">Home</a>

		<button class="dropdown-trigger">
			People <i class="fa-solid fa-chevron-down" />
			<div class="dropdown-nav">
				<CfPeopleNav cfPeople={activePeople} />
			</div>
		</button>

		<a href="../tables/students">Students</a>

		<a href="../tables/applications">Applications</a>

		<button class="dropdown-trigger">
			More <i class="fa-solid fa-chevron-down" />
			<div class="dropdown-nav">
				<ul class="flex flex-col pr-4">
					<li><a href="../tables/schools">Schools</a></li>
					<li><a href="../tables/programs">Programs</a></li>
					<li><div class="divider w-[12rem] h-[1px]" /></li>
					<li>(More)</li>
				</ul>
			</div>
		</button>

		<a href="../about">About</a>
	</nav>
	<svelte:fragment slot="trail">
		<div class="flex flex-wrap flex-shrink gap-4 items-center">
			<a class="nav-link" href="../home">Settings</a>
			<button class="cf-secondary">Log Out</button>
		</div>
	</svelte:fragment>
</AppBar>

<main>
	<slot />
</main>

<footer>
	<div class="p-0 m-0 w-fit mx-auto">(footer)</div>
</footer>

<style lang="postcss">
	.dropdown-trigger:hover {
		@apply text-primary-500;
	}
	.dropdown-nav {
		@apply min-w-[12rem];
		@apply hidden absolute top-12 p-4 pl-6 pb-6;
		@apply text-surface-50 bg-surface-700;
		@apply rounded-sm;
	}
	.dropdown-trigger:hover .dropdown-nav {
		@apply flex z-10;
	}
	footer {
		@apply bg-surface-50 text-surface-900;
		@apply w-full;
		@apply p-4;
	}
</style>
