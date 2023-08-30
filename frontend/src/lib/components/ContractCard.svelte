<script lang="ts">
	import type { ContractListItem } from '$lib/types/contractTypes';
	import { ESSAY_ADVISOR } from '$lib/constants/cfRoles';
	import { statusToClass } from '$lib/utils/contractUtils';

	export let contract: ContractListItem;

	const { type, target_year, services, status } = contract;

	const essayServices = services.filter((s) => s.role === ESSAY_ADVISOR);
	const planningServices = services.filter((s) => s.role !== ESSAY_ADVISOR);
</script>

<a
	href={`../contracts/${contract.id}/`}
	class="contract-card cf-card-shadow-2 cf-card-shadow-2-hover"
>
	<header>
		<div class="text-2xl font-bold my-2">{type} {target_year}</div>

		<div class={`contract-status-chip !min-w-0 !py-1 bg-${statusToClass(status)}`}>
			{status === 'Effective' ? 'In effect' : status}
		</div>
	</header>

	<div class="my-4 flex flex-wrap gap-x-8 gap-y-4">
		<section class="profile-grid">
			{#each planningServices as service}
				<i class="cf-key fa-solid fa-compass self-center" />
				<div class="cf-value">{service.cf_username}</div>
			{/each}
		</section>

		<section class="profile-grid">
			{#each essayServices as service}
				<i class="cf-key fa-solid fa-feather self-center" />
				<div class="cf-value">{service.cf_username}</div>
			{/each}
		</section>
	</div>
</a>

<style lang="postcss">
	.contract-card {
		@apply py-4 px-6 rounded-xl;
		@apply flex flex-col;
		@apply min-h-[12rem];
		transition: all 0.3s ease-in-out;
	}
	.contract-card:hover {
		@apply scale-[101%];
	}

	header {
		@apply p-0 mb-2;
		@apply flex flex-col gap-2;
	}
	.contract-status-chip {
		@apply font-normal text-sm;
		@apply origin-left scale-90 opacity-80;
		width: fit-content !important;
	}
	.profile-grid {
		@apply gap-3;
		@apply min-w-fit;
	}
	.cf-value {
		@apply whitespace-nowrap overflow-hidden text-ellipsis;
	}
</style>
