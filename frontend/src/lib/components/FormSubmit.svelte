<script lang="ts">
	export let message: any; // superforms error message
	export let buttonText = 'Save to database';
	export let successText = '';
</script>

<div class="form-actions flex gap-4">
	<button type="submit" class="btn cf-btn variant-filled-primary text-black">{buttonText}</button>
</div>

{#if message}
	<div class="h-8 mt-2 mb-4 max-w-[28rem]">
		{#if message === 'success' && successText}
			<small class="success-message max-w-sm">{successText}</small>
		{:else}
			<small class="error-message max-w-sm">{message}</small>
		{/if}
	</div>
{/if}
