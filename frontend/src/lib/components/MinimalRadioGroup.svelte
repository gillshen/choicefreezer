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
			{#if target === option}
				&bullet;
			{/if}
			{option}
		</button>
	{/each}
</div>

<style lang="postcss">
	.filter-buttons-container {
		@apply mb-4 w-full flex flex-col items-stretch gap-1;
	}
	button.filter-button {
		border-bottom: 1px solid;
		@apply w-full h-12;
		@apply text-left;
		@apply border-b-primary-500;
	}
	button.filter-button:hover {
		@apply text-primary-700;
	}
	button.filter-button[data-filter-selected='true'] {
		@apply text-primary-500;
	}
</style>
