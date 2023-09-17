<script lang="ts">
	import type { ActScore } from '$lib/types/testScoreTypes';
	import { page } from '$app/stores';
	import { deleteActScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';
	import Dialog from './Dialog.svelte';
	import ActScoreForm from '$lib/forms/ActScoreForm.svelte';

	export let data: ActScore;

	// Apply a non-linear transformation so that 28/36 (net 27/35) corresponds to a half circle
	const exp = 2.4;
	const base = Math.ceil(Math.pow(35, exp));
	const value = data.result ? Math.ceil((Math.pow(data.result - 1, exp) * 100) / base) : 0;
	const handleDelete = scoreDeleter(deleteActScore, data.id);

	let updateDialog: HTMLDialogElement;
</script>

<ScoreCard {data} title="ACT" {value} {handleDelete} onTryUpdate={() => updateDialog.showModal()}>
	<div class="cf-score-key">Math</div>
	<ScoreCardValue value={data.math} />

	<div class="cf-score-key">Science</div>
	<ScoreCardValue value={data.science} />

	<div class="cf-score-key">English</div>
	<ScoreCardValue value={data.english} />

	<div class="cf-score-key">Reading</div>
	<ScoreCardValue value={data.reading} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing} />
</ScoreCard>

<Dialog bind:dialog={updateDialog} exitHelper>
	<ActScoreForm
		bind:dialog={updateDialog}
		action="/scores?/updateActScore"
		studentId={$page.data.student.id}
		data={$page.data.actScoreForm}
		score={data}
	/>
</Dialog>
