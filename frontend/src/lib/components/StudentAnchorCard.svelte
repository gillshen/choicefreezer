<script lang="ts">
	import type { StudentOfUser } from '$lib/types/userTypes';

	export let student: StudentOfUser | null = null;
</script>

{#if student}
	<a href={`../students/${student.id}/`} class="student-anchor card">
		<header class="card-header px-6 pt-4 pb-2 text-sm">
			<!-- TODO colored chip -->
			{student.latest_target_year}
			{student.latest_contract_type.slice(0, 4)}
		</header>
		<section class="flex-grow px-6 pt-2 pb-8 text-lg flex items-center font-bold">
			{student.name}
		</section>
	</a>
{:else}
	<a href="../students/new/" class="student-anchor card">
		<div class="flex-grow flex justify-center items-center bg-primary-500 text-black">
			Create a student
		</div>
	</a>
{/if}

<style lang="postcss">
	.student-anchor,
	.student-anchor div {
		@apply w-[12rem] flex flex-col card-hover rounded-sm min-h-[4rem];
	}
	.student-anchor:hover {
		@apply bg-primary-500 text-black;
	}
</style>
