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

	// Apply a non-linear transformation so that 90/120 corresponds to a half circle
	const exp = 2.4;
	const base = Math.ceil(Math.pow(120, exp));
	const value = data.result ? Math.ceil((Math.pow(data.result, exp) * 100) / base) : 0;
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
