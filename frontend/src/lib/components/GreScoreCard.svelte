<script lang="ts">
	import type { GreScore } from '$lib/types/testScoreTypes';
	import { deleteGreScore } from '$lib/api';
	import { scoreDeleter } from '$lib/utils/scoreUtils';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: GreScore;

	const value = data.result ? ((data.result - 260) * 100) / 80 : 0;
	const handleDelete = scoreDeleter(deleteGreScore, data.id);
</script>

<ScoreCard {data} title="GRE" {value} {handleDelete}>
	<div class="cf-score-key">Verbal</div>
	<ScoreCardValue value={data.verbal} />

	<div class="cf-score-key">Quantitative</div>
	<ScoreCardValue value={data.quant} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing} />
</ScoreCard>
