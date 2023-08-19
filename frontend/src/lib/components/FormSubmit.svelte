<script lang="ts">
	export let message: any; // superforms error message
</script>

<div class="form-actions flex gap-4">
	<button type="submit" class="cf-primary">Save to database</button>
</div>

{#if message}
	<small class="error-message mt-4 mb-4 max-w-sm">{message}</small>
{/if}
