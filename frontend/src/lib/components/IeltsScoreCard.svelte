<script lang="ts">
	import type { IeltsScore } from '$lib/types/testScoreTypes';
	import { page } from '$app/stores';
	import { deleteIeltsScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';
	import Dialog from './Dialog.svelte';
	import IeltsScoreForm from '$lib/forms/IeltsScoreForm.svelte';

	export let data: IeltsScore;

	const value = data.result ? (data.result * 100) / 9 : 0;
	const handleDelete = scoreDeleter(deleteIeltsScore, data.id);

	let updateDialog: HTMLDialogElement;
</script>

<ScoreCard {data} title="IELTS" {value} {handleDelete} onTryUpdate={() => updateDialog.showModal()}>
	<div class="cf-score-key">Listening</div>
	<ScoreCardValue value={data.listening?.toFixed(1)} />

	<div class="cf-score-key">Reading</div>
	<ScoreCardValue value={data.reading?.toFixed(1)} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing?.toFixed(1)} />

	<div class="cf-score-key">Speaking</div>
	<ScoreCardValue value={data.speaking?.toFixed(1)} />
</ScoreCard>

<Dialog bind:dialog={updateDialog} exitHelper>
	<IeltsScoreForm
		bind:dialog={updateDialog}
		action="/scores?/updateIeltsScore"
		studentId={$page.data.student.id}
		data={$page.data.ieltsScoreForm}
		score={data}
	/>
</Dialog>
