<script lang="ts">
	import type { ToeflScore } from '$lib/types/testScoreTypes';
	import { page } from '$app/stores';
	import { deleteToeflScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';
	import Dialog from './Dialog.svelte';
	import ToeflScoreForm from '$lib/forms/ToeflScoreForm.svelte';

	export let data: ToeflScore;

	const value = data.result ? ((data.result - 60) * 100) / 60 : 0;
	const handleDelete = scoreDeleter(deleteToeflScore, data.id);

	let updateDialog: HTMLDialogElement;
</script>

<ScoreCard {data} title="TOEFL" {value} {handleDelete} onTryUpdate={() => updateDialog.showModal()}>
	<div class="cf-score-key">Reading</div>
	<ScoreCardValue value={data.reading} />

	<div class="cf-score-key">Listening</div>
	<ScoreCardValue value={data.listening} />

	<div class="cf-score-key">Speaking</div>
	<ScoreCardValue value={data.speaking} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing} />
</ScoreCard>

<Dialog bind:dialog={updateDialog} exitHelper>
	<ToeflScoreForm
		bind:dialog={updateDialog}
		action="/scores?/updateToeflScore"
		studentId={$page.data.student.id}
		data={$page.data.toeflScoreForm}
		score={data}
	/>
</Dialog>
