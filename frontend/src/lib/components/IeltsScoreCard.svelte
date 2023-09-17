<script lang="ts">
	import type { IeltsScore } from '$lib/types/testScoreTypes';
	import { deleteIeltsScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: IeltsScore;

	const value = data.result ? (data.result * 100) / 9 : 0;
	const handleDelete = scoreDeleter(deleteIeltsScore, data.id);
</script>

<ScoreCard {data} title="IELTS" {value} {handleDelete}>
	<div class="cf-score-key">Listening</div>
	<ScoreCardValue value={data.listening?.toFixed(1)} />

	<div class="cf-score-key">Reading</div>
	<ScoreCardValue value={data.reading?.toFixed(1)} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing?.toFixed(1)} />

	<div class="cf-score-key">Speaking</div>
	<ScoreCardValue value={data.speaking?.toFixed(1)} />
</ScoreCard>
