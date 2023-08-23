<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton';

	import { filterForActive } from '$lib/utils/userUtils.js';
	import CfPeopleNav from '$lib/components/CfPeopleNav.svelte';

	import { clickOutside } from '$lib/utils/clickOutside.js';

	export let data;
	const { cfPeople } = data;

	const activePeople = filterForActive(cfPeople);

	let showPeople = false;
	let showMore = false;
</script>

<AppBar slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">(icon) ChoiceFreezer</svelte:fragment>
	<nav class="flex gap-8 flex-wrap">
		<a href="../home">Home</a>

		<button
			class="dropdown-trigger"
			on:click={() => (showPeople = !showPeople)}
			use:clickOutside={() => showPeople && (showPeople = false)}
		>
			People <i class={`toggle-icon fa-solid fa-chevron-down ${showPeople ? 'open' : ''}`} />
			<div class={`dropdown-nav ${showPeople ? 'open' : ''}`}>
				<div>
					<CfPeopleNav cfPeople={activePeople} />
				</div>
			</div>
		</button>

		<a href="../tables/students">Students</a>

		<a href="../tables/applications">Applications</a>

		<button
			class="dropdown-trigger"
			on:click={() => (showMore = !showMore)}
			use:clickOutside={() => showMore && (showMore = false)}
		>
			More <i class={`toggle-icon fa-solid fa-chevron-down ${showMore ? 'open' : ''}`} />
			<div class={`dropdown-nav ${showMore ? 'open' : ''}`}>
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
		@apply absolute top-14;
		@apply z-10;
		@apply text-surface-50 bg-surface-800;
		@apply rounded-lg;
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		opacity: 1;
		transition: all 0.2s ease-in-out;
		box-shadow: 10px 10px 24px rgb(25, 25, 25), -8px -8px 20px rgb(55, 55, 55);
	}
	.dropdown-nav.open {
		grid-template-rows: 1fr;
		opacity: 1;
	}
	.dropdown-nav * {
		min-height: 0;
	}
	.dropdown-nav > * {
		@apply pl-6;
		transform: scaleY(0);
		transform-origin: top;
		transition: all 0.2s ease-in-out;
	}
	.dropdown-nav.open > * {
		@apply p-4 pl-6 pb-6;
		transform: scaleY(1);
	}
	.toggle-icon {
		transition: all 0.4s ease-in-out;
	}
	.toggle-icon.open {
		rotate: 180deg;
	}
	footer {
		@apply bg-surface-50 text-surface-900;
		@apply w-full;
		@apply p-4;
	}
</style>
