<script>
	export let dialog;
	export let title = '';
	export let exitHelper = false;
</script>

<dialog
	bind:this={dialog}
	on:close
	class="w-full max-w-3xl max-h-[50rem] p-12 text-surface-50 bg-surface-900 border border-primary-500"
>
	{#if title}
		<h2>{title}</h2>
	{/if}

	{#if exitHelper}
		<p class="mb-4 text-secondary-400">Press ESC to exit</p>
	{/if}

	<slot />
</dialog>

<style>
	dialog {
		box-shadow: 18px 18px 36px rgb(25, 25, 25), -18px -18px 36px rgb(55, 55, 55);
		border: none;
	}
</style>
