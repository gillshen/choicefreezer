<script lang="ts">
	export let message: any; // superforms error message
</script>

<div class="form-actions flex gap-4">
	<button type="submit" class="cf-primary">Save to database</button>
</div>

{#if message}
	<div class="my-4 text-error-500 max-w-sm">{message}</div>
{/if}
