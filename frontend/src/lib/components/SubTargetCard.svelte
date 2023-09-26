<script lang="ts">
	import type { SubTarget } from '$lib/types/subTargetTypes';
	import type { ProgramType } from '$lib/types/programTypes';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import EditIconButton from '$lib/components/EditIconButton.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import SubTargetForm from '$lib/forms/SubTargetForm.svelte';
	import { toShortDateWithoutYear, toYear, toTime, formatTimezone } from '$lib/utils/dateUtils';
	import Paragraphs from './Paragraphs.svelte';

	export let subTarget: SubTarget;
	export let targetId: number;
	export let programType: ProgramType;

	const popupTarget = `${subTarget.id}-${new Date().toISOString()}`;
	const popupClick: PopupSettings = {
		event: 'click',
		target: popupTarget,
		placement: 'right'
	};

	$: deadline_date = subTarget.deadline_date;
	$: deadline_time = subTarget.deadline_time;
	$: deadline_timezone = subTarget.deadline_timezone;
	$: decision_date = subTarget.decision_date;

	let updateDialog: HTMLDialogElement;
</script>

<div class="subtarget-card">
	<div class="flex items-center py-2">
		<div class="font-heading-token font-bold text-sm">{subTarget.admission_plan}</div>

		<button class="ml-2 popup-btn" use:popup={popupClick} disabled={!subTarget.comments}>
			<i class="fa-solid fa-circle-info text-sm" />
		</button>

		<div class="subtarget-actions flex ml-auto">
			<EditIconButton
				onClick={() => updateDialog.showModal()}
				classNames="text-primary-400 hover:text-primary-500 text-sm"
			/>
			<!-- <DeleteIconButton classNames="text-error-400 hover:text-error-500" /> -->
		</div>
	</div>

	<div class="flex flex-col gap-3">
		<div class="flex px-3 py-3 bg-yellow-400/90 text-surface-900 rounded-lg h-[76px]">
			<i class="fa-solid fa-calendar-days mt-1.5" />

			{#if deadline_date}
				<div class="flex flex-col ml-4">
					<div class="font-bold flex gap-3 items-baseline">
						<div class="text-2xl">{toShortDateWithoutYear(deadline_date)}</div>
						<div>{toYear(deadline_date)}</div>
					</div>
					{#if deadline_time}
						<div class="text-sm">
							{toTime(deadline_time)}
							{#if deadline_timezone}{formatTimezone(deadline_timezone)}{/if}
						</div>
					{/if}
				</div>
			{:else}
				<div class="no-date text-2xl">?</div>
			{/if}
		</div>

		<div class="flex px-3 py-3 bg-surface-700/50 text-surface-200 rounded-lg items-center">
			<i class="fa-solid fa-bell text-yellow-400/90" />

			{#if decision_date}
				<div class="ml-4">
					{toShortDateWithoutYear(decision_date)}, {toYear(decision_date)}
				</div>
			{:else}
				<div class="no-date">?</div>
			{/if}
		</div>
	</div>
</div>

<div class="rounded-lg bg-surface-600 px-6 py-4 max-w-[24rem]" data-popup={popupTarget}>
	<Paragraphs paragraphs={subTarget.comments} />
	<div class="arrow bg-surface-600" />
</div>

<Dialog bind:dialog={updateDialog} exitHelper>
	<SubTargetForm
		bind:dialog={updateDialog}
		data={$page.data.subTargetUpdateForm}
		action="?/updateSubTarget"
		{targetId}
		{programType}
		{subTarget}
	/>
</Dialog>

<style lang="postcss">
	.subtarget-card {
		@apply border-t border-yellow-400/30;
		@apply mb-4;
		@apply max-w-[200px];
		@apply flex-shrink-0 flex-grow-0;
	}
	.subtarget-actions {
		@apply opacity-0;
		@apply transition-opacity duration-200;
	}
	.subtarget-card:hover .subtarget-actions {
		@apply opacity-100;
	}

	.no-date {
		@apply flex w-full h-full -ml-[14px];
		@apply justify-center items-center font-bold;
	}
</style>
