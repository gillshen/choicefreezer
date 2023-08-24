<script lang="ts">
	import type { ContractListItem } from '$lib/types/contractTypes';
	import { PLANNER, ASST_PLANNER, STRAT_PLANNER, ESSAY_ADVISOR } from '$lib/constants/cfRoles';
	import { typeToClass, typeToInitial, statusToClass } from '$lib/utils/contractUtils';

	export let contract: ContractListItem;

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
		<div class={`contract-status-chip bg-${statusToClass(status)}`}>
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
</a>

<style lang="postcss">
	.contract-card {
		@apply p-4 rounded-xl;
		@apply grid grid-cols-[2fr_3fr] gap-4 items-start;
	}
	.card-left {
		@apply mx-2 py-4;
		@apply flex flex-col gap-2;
	}
	.card-right {
		@apply m-2 px-0 py-2;
		@apply grid grid-cols-[max-content_2fr] gap-x-8 gap-y-4;
	}
	.contract-status-chip {
		@apply font-normal;
		@apply mt-2 origin-left scale-90;
		min-width: none !important;
		width: fit-content !important;
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
