<script lang="ts">
	import type {
		ActScore,
		DetScore,
		GmatScore,
		GreScore,
		IeltsScore,
		LsatScore,
		SatScore,
		ToeflScore
	} from '$lib/types/testScoreTypes';
	import { toShortDate } from '$lib/utils/dateUtils';
	import { ProgressRadial, type PopupSettings, popup } from '@skeletonlabs/skeleton';
	import EditIconButton from './EditIconButton.svelte';
	import DeleteIconButton from './DeleteIconButton.svelte';
	import BinaryDialog from './BinaryDialog.svelte';
	import Paragraphs from './Paragraphs.svelte';

	export let data:
		| ToeflScore
		| IeltsScore
		| DetScore
		| SatScore
		| ActScore
		| GreScore
		| GmatScore
		| LsatScore;
	export let title: string;
	export let value: number; // percentage point
	export let userIsOwner = true;
	export let onTryUpdate: any = null;
	export let handleDelete: any = null;
	export let font = 80;
	export let meter = 'stroke-primary-400';

	let deleteDialog: HTMLDialogElement;

	const popupTarget = `${data.id}-${new Date().toISOString()}`;
	const popupClick: PopupSettings = {
		event: 'click',
		target: popupTarget,
		placement: 'top'
	};
</script>

<div class="cf-score-card">
	<header class="cf-score-card-header">
		<div class="mr-auto">{title}</div>

		{#if userIsOwner}
			<div class="cf-score-card-actions">
				<EditIconButton
					classNames="text-primary-400 hover:text-primary-500"
					onClick={onTryUpdate}
				/>
				<DeleteIconButton
					classNames="text-error-400 hover:text-error-500"
					onClick={() => deleteDialog.showModal()}
				/>
			</div>
		{/if}
	</header>

	<div class="mx-auto">
		<ProgressRadial value={value > 0 ? value : 0} {font} {meter}
			>{data.result ?? 'n/a'}</ProgressRadial
		>
	</div>

	<div class="cf-score-card-aux">
		<time class="cf-score-card-date">
			{#if data.date}
				{toShortDate(data.date)}
			{:else}
				Undated
			{/if}
		</time>

		<button class="cf-btn popup-btn" use:popup={popupClick} disabled={!data.comments}>
			<i class="fa-solid fa-circle-info" />
		</button>
	</div>

	<div class="cf-score-card-body">
		<slot />
	</div>
</div>

<div class="rounded-lg bg-surface-600 px-6 py-4" data-popup={popupTarget}>
	<Paragraphs paragraphs={data.comments} />
	<div class="arrow bg-surface-600" />
</div>

<BinaryDialog
	bind:dialog={deleteDialog}
	title="Delete this test score?"
	onYes={() => {
		deleteDialog.close();
		handleDelete();
	}}
	dangerous
/>

<style lang="postcss">
	.cf-score-card-header {
		@apply h-[30px];
	}
	.cf-score-card-actions {
		@apply flex items-center;
		@apply opacity-0;
		@apply transition-opacity duration-200 ease-in-out;
	}
	.cf-score-card:hover .cf-score-card-actions {
		@apply opacity-100;
	}
</style>
