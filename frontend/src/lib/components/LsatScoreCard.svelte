<script lang="ts">
	import type { LsatScore } from '$lib/types/testScoreTypes';
	import { deleteLsatScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: LsatScore;

	const value = data.result ? ((data.result - 120) * 100) / 60 : 0;
	const handleDelete = scoreDeleter(deleteLsatScore, data.id);
</script>

<ScoreCard {data} title="LSAT" {value} {handleDelete}>
	<div class="cf-score-key">Total</div>
	<ScoreCardValue value={data.total} />
</ScoreCard>
