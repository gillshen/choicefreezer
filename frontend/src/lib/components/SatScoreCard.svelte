<script lang="ts">
	import type { SatScore } from '$lib/types/testScoreTypes';
	import { page } from '$app/stores';
	import { deleteSatScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';
	import Dialog from './Dialog.svelte';
	import SatScoreForm from '$lib/forms/SatScoreForm.svelte';

	export let data: SatScore;

	const value = data.result ? ((data.result - 400) * 100) / 1200 : 0;
	const handleDelete = scoreDeleter(deleteSatScore, data.id);

	let updateDialog: HTMLDialogElement;
</script>

<ScoreCard {data} title="SAT" {value} {handleDelete} onTryUpdate={() => updateDialog.showModal()}>
	<div class="cf-score-key">EBRW</div>
	<ScoreCardValue value={data.ebrw} />

	<div class="cf-score-key">Math</div>
	<ScoreCardValue value={data.math} />
</ScoreCard>

<Dialog bind:dialog={updateDialog} exitHelper>
	<SatScoreForm
		bind:dialog={updateDialog}
		action="/scores?/updateSatScore"
		studentId={$page.data.student.id}
		data={$page.data.satScoreForm}
		score={data}
	/>
</Dialog>
