<script lang="ts">
	import type { ContractListItem } from '$lib/types/contractTypes';
	import { ESSAY_ADVISOR } from '$lib/constants/cfRoles';
	import { statusToClass, typeToClass } from '$lib/utils/contractUtils';
	import { byServiceRoleThenUsername } from '$lib/utils/sortUtils';

	export let contract: ContractListItem;

	const { type, target_year, services, status } = contract;

	const typeClass = typeToClass(type);
	const statusClass = statusToClass(status);

	const essayServices = services
		.filter((s) => s.role === ESSAY_ADVISOR)
		.sort(byServiceRoleThenUsername);

	const planningServices = services
		.filter((s) => s.role !== ESSAY_ADVISOR)
		.sort(byServiceRoleThenUsername);
</script>

<a
	href={`../contracts/${contract.id}/`}
	class={`contract-card border-l-2 h-full border-${typeClass}`}
>
	<header class={`px-6 pt-1 flex justify-between items-center rounded-t-lg `}>
		<div class="text-xl font-bold my-2">
			{type}
			{target_year}
		</div>

		<div class={`contract-status-chip bg-${statusClass}`}>
			{status === 'Effective' ? 'In effect' : status}
		</div>
	</header>

	<footer class="px-6 my-4 grid grid-cols-2 gap-x-4 items-start">
		<section class="services-grid">
			{#each planningServices as service}
				{@const serviceStatus = service.end_date ? 'service-ended' : ''}
				<div>
					<i class={`fa-solid fa-compass text-${typeClass} ${serviceStatus}`} />
				</div>
				<div class={`username ${serviceStatus}`}>{service.cf_username}</div>
			{/each}
		</section>

		<section class="services-grid">
			{#each essayServices as service}
				{@const serviceStatus = service.end_date ? 'service-ended' : ''}
				<div>
					<i class={`fa-solid fa-feather text-${typeClass} ${serviceStatus}`} />
				</div>
				<div class={`username ${serviceStatus}`}>{service.cf_username}</div>
			{/each}
		</section>
	</footer>
</a>

<style lang="postcss">
	.contract-card {
		@apply flex flex-col;
		@apply rounded-r-lg;
		transition: all 0.2s ease-in-out;
	}
	.contract-card:hover {
		@apply bg-surface-700;
	}
	.contract-status-chip {
		@apply scale-90 max-w-[18px] w-fit px-0 py-1;
	}
	.services-grid {
		@apply grid grid-cols-[1.5rem_1fr] gap-y-1;
		@apply items-start;
	}
	.services-grid > div {
		@apply h-6;
	}
	i.service-ended {
		@apply opacity-50;
	}
	.username {
		@apply text-sm font-heading-token;
	}
	.username.service-ended {
		@apply opacity-50;
	}
</style>
