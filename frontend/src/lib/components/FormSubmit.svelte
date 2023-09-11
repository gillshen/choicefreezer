<script lang="ts">
	export let message: any; // superforms error message
	export let buttonText = 'Save to database';
	export let successText = '';
</script>

<div class="form-actions flex gap-4">
	<button type="submit" class="submit cf-btn">{buttonText}</button>
</div>

<div class="h-8 mt-2">
	{#if message === 'success' && successText}
		<small class="success-message max-w-sm">{successText}</small>
	{:else if message}
		<small class="error-message max-w-sm">{message}</small>
	{/if}
</div>
