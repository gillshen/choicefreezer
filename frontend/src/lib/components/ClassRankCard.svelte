<script lang="ts">
	import type { ClassRank } from '$lib/types/enrollmentTypes';
	import { page } from '$app/stores';
	import { deleteClassRank } from '$lib/api';
	import EditIconButton from './EditIconButton.svelte';
	import DeleteIconButton from './DeleteIconButton.svelte';
	import Dialog from './Dialog.svelte';
	import BinaryDialog from './BinaryDialog.svelte';
	import ClassRankForm from '$lib/forms/ClassRankForm.svelte';
	import { toast } from '$lib/utils/interactiveUtils';
	import { invalidateAll } from '$app/navigation';
	import { UNKNOWN_ERROR } from '$lib/constants/messages';

	export let rank: ClassRank;
	export let userIsOwner: boolean;

	let rankUpdateDialog: HTMLDialogElement;
	let rankDeleteDialog: HTMLDialogElement;

	async function handleDeleteClassRank() {
		const response = await deleteClassRank(rank.id);
		if (response.ok) {
			invalidateAll();
			rankDeleteDialog.close();
			toast('Class rank deleted', 'success');
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}
</script>

<div class="class-rank-card">
	<div class="cf-entry-label">
		{rank.progression} - {rank.term}
	</div>

	<div class="flex items-baseline gap-1">
		{#if rank.top_x}
			<span class="text-surface-200 text-sm">Top</span>
			<span class="text-primary-400 text-xl">{rank.top_x}%</span>
			{#if rank.class_size}
				<span class="text-surface-200 text-sm"> of {rank.class_size}</span>
			{/if}
		{:else}
			<div class="flex gap-1 items-baseline">
				<span class="text-primary-400 text-xl">{rank.rank}</span>
				<span class="text-surface-200 text-sm">/</span>
				<span class="text-surface-200 text-sm">{rank.class_size}</span>
			</div>
		{/if}

		{#if userIsOwner}
			<div class="class-rank-actions">
				<EditIconButton
					classNames="text-primary-400 hover:text-primary-500"
					onClick={() => {
						// activeService = service;
						rankUpdateDialog.showModal();
					}}
				/>
				<DeleteIconButton
					classNames="text-error-400 hover:text-error-500"
					onClick={() => {
						// activeService = service;
						rankDeleteDialog.showModal();
					}}
				/>
			</div>
		{/if}
	</div>
</div>

<Dialog bind:dialog={rankUpdateDialog} exitHelper>
	<ClassRankForm
		bind:dialog={rankUpdateDialog}
		action="/attendances?/updateClassRank"
		data={$page.data.updateClassRankForm}
		classRank={rank}
	/>
</Dialog>

<BinaryDialog
	title="Delete this class rank?"
	bind:dialog={rankDeleteDialog}
	onYes={handleDeleteClassRank}
	dangerous
/>

<style lang="postcss">
	.class-rank-card {
		@apply flex flex-col gap-2;
		@apply py-2 px-4 rounded-md;
		@apply bg-surface-700;
	}
	.class-rank-actions {
		@apply ml-auto flex items-center;
		@apply opacity-0;
		@apply transition-opacity duration-200 ease-in-out;
	}
	.class-rank-card:hover .class-rank-actions {
		@apply opacity-100;
	}
</style>
