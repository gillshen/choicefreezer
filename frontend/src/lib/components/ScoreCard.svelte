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
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import EditIconButton from './EditIconButton.svelte';
	import DeleteIconButton from './DeleteIconButton.svelte';
	import BinaryDialog from './BinaryDialog.svelte';

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
</script>

<div class="cf-score-card">
	<header class="cf-score-card-header">
		<div class="mr-auto">{title}</div>

		{#if userIsOwner}
			<div class="cf-score-card-actions">
				<EditIconButton onClick={onTryUpdate} />
				<DeleteIconButton onClick={() => deleteDialog.showModal()} />
			</div>
		{/if}
	</header>

	<div class="mx-auto">
		<ProgressRadial {value} {font} {meter}>{data.result ?? 'n/a'}</ProgressRadial>
	</div>

	<div class="cf-score-card-date">
		{#if data.date}
			{toShortDate(data.date)}
		{:else}
			Undated
		{/if}
	</div>

	<div class="cf-score-card-body">
		<slot />
	</div>
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
		opacity: 0;
		height: 0;
		transition: all 0.2s ease-in-out;
		@apply flex items-center;
	}
	.cf-score-card:hover .cf-score-card-actions {
		opacity: 1;
		height: 100%;
	}
</style>
