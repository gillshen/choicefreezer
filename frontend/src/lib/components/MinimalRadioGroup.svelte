<script lang="ts">
	export let target: any;
	export let options: any[];
</script>

<div class="filter-buttons-container">
	{#each options as option}
		<button
			class="filter-button"
			data-filter-selected={target === option ? 'true' : 'false'}
			on:click={() => (target = option)}
		>
			{option}
		</button>
	{/each}
</div>

<style lang="postcss">
	.filter-buttons-container {
		@apply mb-4 w-full flex flex-col items-stretch gap-1;
	}
	button.filter-button {
		@apply w-full h-12;
		@apply px-4;
		@apply rounded-md;
		@apply text-left;
		@apply border-2;
		@apply border-transparent;
	}
	button.filter-button:hover {
		@apply bg-surface-700;
	}
	button.filter-button[data-filter-selected='true'] {
		@apply text-primary-500;
		@apply border-b-primary-900;
		@apply rounded-b-none;
	}
</style>
