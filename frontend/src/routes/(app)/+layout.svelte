<script lang="ts">
	import { clickOutside } from '$lib/utils/clickOutside.js';

	import {
		filterForActive,
		filterForEssayAdvisors,
		filterForPlannersExcludingEssayAdvisors
	} from '$lib/utils/userUtils.js';

	import CfPeopleNav from '$lib/components/CfPeopleNav.svelte';
	import CfPeopleNavUnit from '$lib/components/CfPeopleNavUnit.svelte';

	export let data;
	const { username, cfPeople } = data;

	const activePeople = filterForActive(cfPeople);

	let showPeople = false;
	let showMore = false;
	let showUserMenu = false;
</script>

<header class="match-hero flex justify-between rounded-tr-3xl mt-4 mx-8 font-heading-token">
	<div class="cf-logo w-fit bg-surface-900 px-8 py-6 rounded-br-3xl flex items-center">(logo)</div>

	<div class="bg-surface-900 w-full h-full">
		<nav class="match-hero h-full w-full flex flex-wrap justify-between pl-8 rounded-t-3xl">
			<ul class="mx-auto flex flex-wrap gap-8 items-center">
				<li><a href="../home">Home</a></li>

				<li>
					<button
						class="dropdown-trigger"
						on:click={() => (showPeople = !showPeople)}
						use:clickOutside={() => showPeople && (showPeople = false)}
					>
						People <i class={`toggle-icon fa-solid fa-chevron-down ${showPeople ? 'open' : ''}`} />
						<div class={`dropdown-nav -translate-x-[250px] people ${showPeople ? 'open' : ''}`}>
							<div>
								<CfPeopleNav cfPeople={activePeople} />
							</div>
						</div>
					</button>
				</li>

				<li><a href="../tables/students">Students</a></li>

				<li><a href="../tables/applications">Applications</a></li>

				<li>
					<button
						class="dropdown-trigger"
						on:click={() => (showMore = !showMore)}
						use:clickOutside={() => showMore && (showMore = false)}
					>
						More <i class={`toggle-icon fa-solid fa-chevron-down ${showMore ? 'open' : ''}`} />
						<div class={`dropdown-nav -translate-x-[24px] ${showMore ? 'open' : ''}`}>
							<ul class="flex flex-col pr-4">
								<li><a href="../tables/schools">Schools</a></li>
								<li><a href="../tables/programs">Programs</a></li>
								<li>Requirements</li>
								<li>Essays</li>
								<li>The Commons</li>
							</ul>
						</div>
					</button>
				</li>
			</ul>

			<button
				class="dropdown-trigger flex gap-2 items-center py-2 ml-24 pr-12 w-fit hover:text-primary-500"
				on:click={() => (showUserMenu = !showUserMenu)}
				use:clickOutside={() => showUserMenu && (showUserMenu = false)}
			>
				<i class="fa-solid fa-circle-user" />
				{username}
				<nav
					class={`dropdown-nav -translate-x-[60px] w-[140px] z-50 ${showUserMenu ? 'open' : ''}`}
				>
					<ul class="flex flex-col">
						<li>
							<a href="../user" class="nav-link flex gap-2 justify-between items-center"
								><i class="fa-solid fa-gear" />Settings</a
							>
						</li>
						<li>
							<a
								href="../logout"
								data-sveltekit-preload-data="off"
								class="nav-link flex gap-2 justify-between items-center"
								><i class="fa-solid fa-arrow-right-from-bracket" />Log Out</a
							>
						</li>
					</ul>
				</nav>
			</button>
		</nav>
	</div>
</header>

<main>
	<slot />
</main>

<footer class="page-footer">
	<div class="py-0 px-4 m-0 mx-auto grid grid-cols-4 gap-8 max-w-7xl w-full font-heading-token">
		<!-- site map -->
		<section>
			<div class="section-title">The Freezer</div>
			<nav>
				<ul>
					<li><a href="../home">Home</a></li>
					<li><a href="../tables/students/">Students</a></li>
					<li><a href="../tables/applications/">Applications</a></li>
					<li><a href="../tables/schools/">Schools</a></li>
					<li><a href="../tables/programs/">Programs</a></li>
					<li>Requirements</li>
					<li>Essays</li>
					<li>The Commons</li>
					<li><a href="../about/">About</a></li>
				</ul>
			</nav>
		</section>

		<section class="col-span-2">
			<div class="section-title">People</div>
			<div class="grid grid-cols-2 gap-4">
				<nav>
					<ul class="grid grid-cols-2">
						<CfPeopleNavUnit
							cfPeople={filterForPlannersExcludingEssayAdvisors(activePeople)}
							classNames="text-sm gap-1"
						/>
					</ul>
				</nav>

				<nav>
					<ul class="grid grid-cols-2">
						<CfPeopleNavUnit
							cfPeople={filterForEssayAdvisors(activePeople)}
							classNames="text-sm gap-1"
						/>
					</ul>
				</nav>
			</div>
		</section>

		<section>
			<div class="section-title">Links</div>
			<nav>
				<ul class="flex flex-col">
					<li>
						<a href="https://github.com/gillshen/choicefreezer" target="_blank">This project</a>
					</li>
					<li>
						<a href="https://www.reddit.com/r/ApplyingToCollege/" target="_blank">A2C</a>
					</li>
					<li>
						<a href="https://www.usnews.com/best-colleges" target="_blank">The Evil</a>
					</li>
					<li>
						<a href="https://www.google.com/search?q=squirrel&tbm=isch" target="_blank">The Good</a>
					</li>
					<li>
						<a href="http://www.choicefree.com.cn/" target="_blank">A certain company</a>
					</li>
				</ul>
			</nav>
		</section>

		<section class="col-span-4 flex text-sm text-surface-500">
			<div>&copy; CF People</div>
			<div>All rights relinquished to capitalism</div>
		</section>
	</div>
</footer>

<style lang="postcss">
	nav,
	nav * {
		@apply text-sm;
	}

	.match-hero {
		@apply bg-surface-800;
	}

	.dropdown-trigger:hover {
		@apply text-primary-500;
	}
	.dropdown-nav {
		@apply absolute top-[72px];
		@apply z-10;
		@apply text-surface-50 bg-surface-800;
		@apply rounded-lg;
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		opacity: 0;
		transition: all 0.2s ease-in-out;
		box-shadow: 10px 10px 20px #111212, -10px 10px 20px #111212, 0px 10px 20px #2f3030;
	}
	.dropdown-nav.open {
		grid-template-rows: 1fr;
		opacity: 1;
	}
	.dropdown-nav * {
		min-height: 0;
	}
	.dropdown-nav > * {
		@apply px-6;
		transform: scaleY(0);
		transform-origin: top;
		transition: all 0.3s ease-in-out;
	}
	.dropdown-nav.open > * {
		@apply py-4 px-6;
		transform: scaleY(1);
	}
	.dropdown-nav.people {
		@apply pl-6;
	}
	.dropdown-nav.people.open > * {
		@apply pb-6;
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
		@apply p-4 pb-8;
	}
	footer section {
		@apply min-w-[10rem];
		@apply py-2 px-4;
		@apply flex flex-col gap-1;
	}
	footer section > .section-title {
		@apply text-lg font-bold;
		@apply pb-1 mb-1;
		@apply w-full;
		@apply border-b border-surface-300;
	}
	footer section ul {
		@apply flex flex-col gap-1;
		font-family: 'Montserrat';
	}
</style>
