<script lang="ts">
	export let dialog: HTMLDialogElement;
	export let title = '';
	export let onYes = () => {};
	export let yesButtonText = 'Yes';
	export let noButtonText = 'No';
	export let dangerous = false;
</script>

<dialog
	bind:this={dialog}
	on:close
	class="w-fit max-w-sm px-12 py-6 text-surface-50 bg-surface-800"
>
	{#if title || dangerous}
		<h3
			class={`m-0 p-0 mb-4 text-base font-heading-token flex gap-3 items-start ${
				dangerous ? 'text-warning-400' : ''
			}`}
		>
			{#if dangerous}
				<i class="fa-solid fa-triangle-exclamation mt-1" />
			{/if}
			{title}
		</h3>
	{/if}

	<slot />

	<div class="mt-8 flex gap-4 justify-center">
		<button
			class={`btn cf-btn ${dangerous ? 'variant-filled-error text-black' : ''}`}
			on:click={onYes}>{yesButtonText}</button
		>
		<button class="btn cf-btn bg-surface-700 hover:bg-surface-600" on:click={() => dialog.close()}
			>{noButtonText}</button
		>
	</div>
</dialog>

<style lang="postcss">
	button {
		@apply py-1 min-w-[6rem];
	}
</style>
