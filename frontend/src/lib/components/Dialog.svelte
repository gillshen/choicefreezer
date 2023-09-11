<script>
	export let dialog;
	export let title = '';
	export let exitHelper = false;
</script>

<dialog
	bind:this={dialog}
	on:close
	class="w-full max-w-3xl max-h-[80vh] p-12 text-surface-50 bg-surface-800"
>
	{#if title || exitHelper}
		<div class="flex flex-col gap-4 mb-8">
			{#if title}
				<h2 class="w-full text-xl font-heading-token font-bold">{title}</h2>
			{/if}
			{#if exitHelper}
				<p class="text-warning-400">Press ESC to exit</p>
			{/if}
		</div>
	{/if}

	<slot />
</dialog>
