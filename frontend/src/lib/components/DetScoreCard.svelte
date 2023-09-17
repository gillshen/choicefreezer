<script lang="ts">
	import type { DetScore } from '$lib/types/testScoreTypes';
	import { page } from '$app/stores';
	import { deleteDetScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';
	import Dialog from './Dialog.svelte';
	import DetScoreForm from '$lib/forms/DetScoreForm.svelte';

	export let data: DetScore;

	// Apply a non-linear transformation so that 120/160 (net 110/150) corresponds to a half circle
	const exp = 2.2;
	const base = Math.ceil(Math.pow(150, exp));
	const value = data.result ? Math.ceil((Math.pow(data.result - 10, exp) * 100) / base) : 0;
	const handleDelete = scoreDeleter(deleteDetScore, data.id);

	let updateDialog: HTMLDialogElement;
</script>

<ScoreCard {data} title="DET" {value} {handleDelete} onTryUpdate={() => updateDialog.showModal()}>
	<div class="cf-score-key">Literacy</div>
	<ScoreCardValue value={data.literacy} />

	<div class="cf-score-key">Comprehension</div>
	<ScoreCardValue value={data.comprehension} />

	<div class="cf-score-key">Conversation</div>
	<ScoreCardValue value={data.conversation} />

	<div class="cf-score-key">Production</div>
	<ScoreCardValue value={data.production} />
</ScoreCard>

<Dialog bind:dialog={updateDialog} exitHelper>
	<DetScoreForm
		bind:dialog={updateDialog}
		action="/scores?/updateDetScore"
		studentId={$page.data.student.id}
		data={$page.data.detScoreForm}
		score={data}
	/>
</Dialog>
