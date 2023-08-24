<script lang="ts">
	import type { Contract } from '$lib/types/contractTypes';
	import { PLANNER, ASST_PLANNER, STRAT_PLANNER, ESSAY_ADVISOR } from '$lib/constants/cfRoles';
	import { typeToClass, typeToInitial } from '$lib/utils/contractUtils';

	export let contract: Contract;

	const { type, target_year, services, status } = contract;

	function filterByRole(role: string) {
		return services.filter((s) => s.role === role).map((s) => s.cf_username);
	}

	const roles = [STRAT_PLANNER, PLANNER, ASST_PLANNER, ESSAY_ADVISOR];
	const servicesByRole: { [key: string]: string[] } = {};

	for (const role of roles) {
		servicesByRole[role] = filterByRole(role);
	}
</script>

<a
	href={`../contracts/${contract.id}/`}
	class="contract-card cf-card-shadow cf-card-shadow-hover card-hover"
>
	<section class="card-left">
		<div class="flex items-center gap-2">
			<div class={`type-mark bg-${typeToClass(type)}`}>
				{typeToInitial(type)}
			</div>
			<div class="text-3xl font-bold">{target_year}</div>
		</div>
		<div class={`status-chip bg-${status.toLowerCase()}`}>
			{status === 'Effective' ? 'In effect' : status}
		</div>
	</section>

	<section class="card-right profile-grid">
		{#each roles as role}
			{#if servicesByRole[role].length}
				<div class="cf-key">{role}</div>
				<div class="cf-value">
					{servicesByRole[role].sort().join(', ')}
				</div>
			{/if}
		{/each}
	</section>

	<section class="actions">
		<!-- Move to contract page -->
		<slot />
	</section>
</a>

<style lang="postcss">
	.contract-card {
		@apply p-4 rounded-xl grid grid-cols-[2fr_3fr] gap-4;
	}
	.card-left {
		@apply mx-2 py-4;
		@apply flex flex-col gap-2;
	}
	.card-right {
		@apply m-2 px-0 py-2;
		@apply grid grid-cols-[max-content_2fr] gap-x-8 gap-y-4;
	}
	.status-chip {
		@apply max-w-fit mt-4 px-4 py-1 rounded-full origin-left scale-90;
	}
	.type-mark {
		@apply w-8 h-8;
		@apply font-bold text-surface-900;
		@apply rounded-full;
		@apply flex justify-center items-center;
	}
	.actions {
		@apply flex-grow flex gap-2 items-end justify-start;
	}
</style>
