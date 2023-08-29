<script lang="ts">
	export let title: string;
	export let score: string | number | null = null;
</script>

<div class="score-card cf-card-shadow-concave">
	<header class="cf-key text-sm">{title}</header>
	{#if score === null}
		<div class="text-3xl font-bold self-center text-surface-400">n/a</div>
	{:else}
		<div class="text-3xl font-bold self-center">{score}</div>
	{/if}
</div>

<style lang="postcss">
	.score-card {
		@apply flex justify-between items-start;
		@apply min-h-[8rem];
		@apply pt-4 pb-2 px-6;
		@apply rounded-lg;
	}
</style>
