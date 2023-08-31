<script lang="ts">
	export let message: any; // superforms error message
	export let successText = '';
</script>

<div class="form-actions flex gap-4">
	<button type="submit" class="cf-primary">Save to database</button>
</div>

<div class="h-8 mt-2">
	{#if message === 'success' && successText}
		<small class="success-message max-w-sm">{successText}</small>
	{:else if message}
		<small class="error-message max-w-sm">{message}</small>
	{/if}
</div>
