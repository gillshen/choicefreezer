<script lang="ts">
	import type { Contract } from '$lib/types/contractTypes';
	import { PLANNER, ASST_PLANNER, STRAT_PLANNER, ESSAY_ADVISOR } from '$lib/constants/cfRoles';

	export let contract: Contract;

	const { type, target_year, services } = contract;

	function filterByRole(role: string) {
		return services.filter((s) => s.role === role).map((s) => s.cf_username);
	}

	const roles = [STRAT_PLANNER, PLANNER, ASST_PLANNER, ESSAY_ADVISOR];
	const servicesByRole: { [key: string]: string[] } = {};

	for (const role of roles) {
		servicesByRole[role] = filterByRole(role);
	}
</script>

<article class="card">
	<header class="card-header">
		<div class="text-3xl font-bold">{target_year}</div>
		<div class="text-xl">{type}</div>
	</header>

	<section class="card-footer">
		{#each roles as role}
			{#if servicesByRole[role].length}
				<div class="flex flex-col gap-1">
					<div class="cf-key">{role}</div>
					<div class="cf-value">
						{servicesByRole[role].sort().join(', ')}
					</div>
				</div>
			{/if}
		{/each}
	</section>

	<section class="actions">
		<!-- actions slot -->
		<slot />
	</section>
</article>

<style lang="postcss">
	.card {
		border: thin solid;
		@apply border-surface-400 w-[18rem] flex flex-col;
	}
	.card-header {
		@apply m-4 p-0 pb-4 border-b-2 border-b-primary-500 flex flex-col gap-2;
	}
	.card-footer {
		@apply mb-0 pb-2 flex flex-col gap-4;
	}
	.card .actions {
		@apply px-4 pb-4 flex-grow flex gap-4 items-end justify-end;
	}
</style>
