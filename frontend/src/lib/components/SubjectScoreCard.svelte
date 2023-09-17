<script lang="ts">
	import type { AlevelGrade, ApScore, IbGrade } from '$lib/types/testScoreTypes';
	import { page } from '$app/stores';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import { toMonthYear } from '$lib/utils/dateUtils';
	import { ProgressBar, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import EditIconButton from './EditIconButton.svelte';
	import DeleteIconButton from './DeleteIconButton.svelte';
	import Dialog from './Dialog.svelte';
	import BinaryDialog from './BinaryDialog.svelte';
	import ApScoreForm from '$lib/forms/ApScoreForm.svelte';
	import AlevelGradeForm from '$lib/forms/AlevelGradeForm.svelte';
	import IbGradeForm from '$lib/forms/IbGradeForm.svelte';
	import {
		deleteApScore,
		deleteIbPredictedGrade,
		deleteIbFinalGrade,
		deleteAlevelPredictedGrade,
		deleteAlevelFinalGrade
	} from '$lib/api';
	import Paragraphs from './Paragraphs.svelte';

	export let data: ApScore | IbGrade | AlevelGrade;
	export let gradeType: 'predicted' | 'final' | undefined = undefined;
	export let userIsOwner = true;

	let grade: string | number | null = null;
	let value: number | null = null;
	let max: number;
	let handleDelete: () => void;

	if ('percentage' in data) {
		// A Level
		grade = data.grade;
		value = data.percentage;
		max = 100;
		handleDelete = scoreDeleter(
			gradeType === 'predicted' ? deleteAlevelPredictedGrade : deleteAlevelFinalGrade,
			data.id
		);
	} else if ('grade' in data) {
		// IB
		grade = data.grade;
		value = data.grade;
		max = 7;
		handleDelete = scoreDeleter(
			gradeType === 'predicted' ? deleteIbPredictedGrade : deleteIbFinalGrade,
			data.id
		);
	} else {
		// AP
		grade = data.score;
		value = data.score;
		max = 5;
		handleDelete = scoreDeleter(deleteApScore, data.id);
	}

	let updateDialog: HTMLDialogElement;
	let deleteDialog: HTMLDialogElement;

	const popupTarget = `${data.id}-${new Date().toISOString()}`;
	const popupClick: PopupSettings = {
		event: 'click',
		target: popupTarget,
		placement: 'top'
	};
</script>

<div class="cf-subject-score-card">
	<div class="text-surface-50 flex gap-4 items-baseline">
		<div class="whitespace-nowrap overflow-hidden text-ellipsis">{data.subject}</div>

		{#if userIsOwner}
			<div class="cf-subject-score-card-actions">
				<EditIconButton
					classNames="text-primary-400 hover:text-primary-500"
					onClick={() => updateDialog.showModal()}
				/>
				<DeleteIconButton
					classNames="text-error-400 hover:text-error-500"
					onClick={() => deleteDialog.showModal()}
				/>
			</div>
		{/if}
	</div>

	<div class="grid grid-cols-[auto_1fr_80px_16px] gap-x-2 items-center">
		<div
			class="text-lg font-bold w-8 h-8 mr-2 flex justify-center items-center rounded-full border border-primary-400/40"
		>
			{grade ?? ''}
		</div>

		<ProgressBar
			value={value ?? 0}
			{max}
			height="h-1"
			meter="bg-primary-400"
			track="bg-surface-500/30"
		/>

		<div class="text-surface-300 text-sm ml-2">
			{data.date ? toMonthYear(data.date) : 'Undated'}
		</div>

		<button class="cf-btn score-comment pr-1" use:popup={popupClick} disabled={!data.comments}>
			<i class="fa-regular fa-message" />
		</button>
	</div>
</div>

<div class="rounded-lg bg-surface-500 px-6 py-4" data-popup={popupTarget}>
	<Paragraphs paragraphs={data.comments} />
	<div class="arrow variant-filled-surface" />
</div>

<Dialog bind:dialog={updateDialog} exitHelper>
	{#if 'percentage' in data}
		<AlevelGradeForm
			bind:dialog={updateDialog}
			action={gradeType === 'predicted'
				? '/scores?/updateAlevelPredictedGrade'
				: '/scores?/updateAlevelFinalGrade'}
			studentId={$page.data.student.id}
			data={$page.data.alevelGradeForm}
			grade={data}
		/>
	{:else if 'grade' in data}
		<IbGradeForm
			bind:dialog={updateDialog}
			action={gradeType === 'predicted'
				? '/scores?/updateIbPredictedGrade'
				: '/scores?/updateIbFinalGrade'}
			studentId={$page.data.student.id}
			data={$page.data.ibGradeForm}
			grade={data}
		/>
	{:else}
		<ApScoreForm
			bind:dialog={updateDialog}
			action="/scores?/updateApScore"
			studentId={$page.data.student.id}
			data={$page.data.apScoreForm}
			score={data}
		/>
	{/if}
</Dialog>

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
	.cf-subject-score-card {
		@apply flex flex-col gap-1;
	}

	.cf-subject-score-card-actions {
		@apply flex items-center flex-grow;
		@apply opacity-0;
		@apply transition-opacity duration-200;
	}
	.cf-subject-score-card:hover .cf-subject-score-card-actions {
		@apply opacity-100;
	}
</style>
