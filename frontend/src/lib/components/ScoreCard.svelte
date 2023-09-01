<script lang="ts">
	export let title: string;
	export let score: string | number | null = null;
</script>

<div class="score-card cf-card-shadow-convex">
	<header class="cf-key text-sm">{title}</header>
	{#if score === null}
		<div class="cf-value text-surface-400">n/a</div>
	{:else}
		<div class="cf-value">{score}</div>
	{/if}
</div>

<style lang="postcss">
	.score-card {
		@apply flex justify-between items-center;
		@apply py-4 px-6;
		@apply rounded-lg;
	}
	.cf-value {
		@apply text-2xl font-bold;
		@apply self-center tracking-wider;
	}
</style>
