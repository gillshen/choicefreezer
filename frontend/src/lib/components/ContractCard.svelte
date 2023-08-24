<script lang="ts">
	import type { ContractListItem } from '$lib/types/contractTypes';
	import { typeToClass, typeToInitial, statusToClass } from '$lib/utils/contractUtils';
	import { byServiceRoleThenUsername } from '$lib/utils/sortUtils';

	export let contract: ContractListItem;

	const { type, target_year, services, status } = contract;
</script>

<a
	href={`../contracts/${contract.id}/`}
	class="contract-card cf-card-shadow cf-card-shadow-hover card-hover"
>
	<section class="card-left">
		<div class="flex gap-4">
			<div class={`type-mark bg-${typeToClass(type)}`}>
				{typeToInitial(type)}
			</div>
			<div class="text-4xl font-bold">{target_year}</div>
		</div>

		<div class={`contract-status-chip bg-${statusToClass(status)}`}>
			{status === 'Effective' ? 'In effect' : status}
		</div>
	</section>

	<section class="card-right profile-grid">
		{#each services.sort(byServiceRoleThenUsername) as service}
			<div class="cf-key">{service.role}</div>
			<div class="cf-value">{service.cf_username}</div>
		{/each}
	</section>
</a>

<style lang="postcss">
	.contract-card {
		@apply p-4 rounded-xl;
		@apply min-h-[10rem];
		@apply grid grid-cols-[1fr_1fr] gap-4 items-start;
	}
	.card-left {
		@apply mx-2 pt-3;
		@apply flex flex-col gap-4;
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
		@apply aspect-square text-lg;
		@apply font-bold text-surface-900;
		@apply rounded-full;
		@apply flex justify-center items-center;
	}
	.profile-grid {
		@apply gap-y-3;
	}
</style>
