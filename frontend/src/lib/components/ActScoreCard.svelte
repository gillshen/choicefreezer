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

	const value = data.result ? ((data.result - 18) * 100) / 18 : 0;
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
