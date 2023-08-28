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
	class="w-fit max-w-prose max-h-[50rem] px-12 py-8 text-surface-50 bg-surface-900"
>
	{#if title || dangerous}
		<h3 class="m-0 p-0 mb-4 text-xl font-bold flex gap-4 items-center">
			{#if dangerous}
				<i class="fa-solid fa-triangle-exclamation" />
			{/if}
			{title}
		</h3>
	{/if}

	<slot />

	<div class="mt-12 flex gap-4 justify-center">
		<button class="cf-primary" on:click={onYes}>{yesButtonText}</button>
		<button class="cf-secondary bg-surface-800 hover:bg-surface-700" on:click={() => dialog.close()}
			>{noButtonText}</button
		>
	</div>
</dialog>
