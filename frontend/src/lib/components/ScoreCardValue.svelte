<script lang="ts">
	export let value: number | string | null | undefined;
</script>

{#if typeof value === 'number'}
	<div class="cf-score-value numeric">{value}</div>
{:else if typeof value === 'string'}
	<div class="cf-score-value string">{value}</div>
{:else}
	<div class="cf-score-value null">n/a</div>
{/if}
