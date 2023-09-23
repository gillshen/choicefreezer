<script lang="ts">
	import type { Gpa } from '$lib/types/enrollmentTypes';
	import { page } from '$app/stores';
	import { deleteGpa } from '$lib/api';
	import EditIconButton from './EditIconButton.svelte';
	import DeleteIconButton from './DeleteIconButton.svelte';
	import Dialog from './Dialog.svelte';
	import BinaryDialog from './BinaryDialog.svelte';
	import GpaForm from '$lib/forms/GpaForm.svelte';
	import { toast } from '$lib/utils/interactiveUtils';
	import { invalidateAll } from '$app/navigation';
	import { UNKNOWN_ERROR } from '$lib/constants/messages';
	import { formatProgression } from '$lib/utils/enrollmentUtils';

	export let gpa: Gpa;
	export let userIsOwner: boolean;

	let gpaUpdateDialog: HTMLDialogElement;
	let gpaDeleteDialog: HTMLDialogElement;

	async function handleDeleteGpa() {
		const response = await deleteGpa(gpa.id);
		if (response.ok) {
			invalidateAll();
			gpaDeleteDialog.close();
			toast('GPA deleted', 'success');
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}
</script>

<div class="gpa-card">
	<div class="cf-entry-label">
		{formatProgression(gpa.progression)} - {gpa.term} ({gpa.is_cumulative ? 'Cumul.' : 'Term'})
	</div>
	<div class="flex items-baseline gap-1">
		<span class={`${gpa.is_cumulative ? 'text-primary-400' : 'text-surface-200'} text-xl`}
			>{gpa.value}</span
		>
		<span class="text-surface-200 text-sm">/</span>
		<span class="text-surface-200 text-sm">{gpa.scale}</span>

		{#if userIsOwner}
			<div class="gpa-actions">
				<EditIconButton
					classNames="text-primary-400 hover:text-primary-500"
					onClick={() => {
						// activeService = service;
						gpaUpdateDialog.showModal();
					}}
				/>
				<DeleteIconButton
					classNames="text-error-400 hover:text-error-500"
					onClick={() => {
						// activeService = service;
						gpaDeleteDialog.showModal();
					}}
				/>
			</div>
		{/if}
	</div>
</div>

<Dialog bind:dialog={gpaUpdateDialog} exitHelper>
	<GpaForm
		bind:dialog={gpaUpdateDialog}
		action="/attendances?/updateGpa"
		data={$page.data.updateGpaForm}
		{gpa}
	/>
</Dialog>

<BinaryDialog
	title="Delete this GPA record?"
	bind:dialog={gpaDeleteDialog}
	onYes={handleDeleteGpa}
	dangerous
/>

<style lang="postcss">
	.gpa-card {
		@apply flex flex-col gap-2;
		@apply py-2 px-4 rounded-md;
		@apply bg-surface-700;
	}
	.gpa-actions {
		@apply ml-auto flex items-center;
		@apply opacity-0;
		@apply transition-opacity duration-200 ease-in-out;
	}
	.gpa-card:hover .gpa-actions {
		@apply opacity-100;
	}
</style>
