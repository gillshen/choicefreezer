<script lang="ts">
	import type { LsatScore } from '$lib/types/testScoreTypes';
	import { page } from '$app/stores';
	import { deleteLsatScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';
	import Dialog from './Dialog.svelte';
	import LsatScoreForm from '$lib/forms/LsatScoreForm.svelte';

	export let data: LsatScore;

	const value = data.result ? ((data.result - 120) * 100) / 60 : 0;
	const handleDelete = scoreDeleter(deleteLsatScore, data.id);

	let updateDialog: HTMLDialogElement;
</script>

<ScoreCard {data} title="LSAT" {value} {handleDelete} onTryUpdate={() => updateDialog.showModal()}>
	<div class="cf-score-key">Total</div>
	<ScoreCardValue value={data.total} />
</ScoreCard>

<Dialog bind:dialog={updateDialog} exitHelper>
	<LsatScoreForm
		bind:dialog={updateDialog}
		action="/scores?/updateLsatScore"
		studentId={$page.data.student.id}
		data={$page.data.lsatScoreForm}
		score={data}
	/>
</Dialog>
