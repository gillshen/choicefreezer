<script lang="ts">
	export let dialog: HTMLDialogElement;
	export let title = '';
	export let onOkay = () => {};
	export let okayButtonText = 'OK';
	export let cancelButtonText = 'Cancel';
	export let dangerous = false;
</script>

<dialog
	bind:this={dialog}
	on:close
	class="w-full max-w-xl max-h-[50rem] px-12 py-8 text-surface-50 bg-surface-900"
>
	{#if title || dangerous}
		<h3 class="m-0 p-0 mb-4 font-bold">
			{#if dangerous}
				<i class="fa-solid fa-triangle-exclamation mr-2" />
			{/if}
			{title}
		</h3>
	{/if}

	<slot />

	<div class="mt-12 grid grid-cols-3 gap-4">
		<button class="cf-primary" on:click={onOkay}>{okayButtonText}</button>
		<button class="btn bg-surface-800 hover:bg-surface-700" on:click={() => dialog.close()}
			>{cancelButtonText}</button
		>
	</div>
</dialog>

<style lang="postcss">
	button {
		@apply rounded-md;
	}
</style>
