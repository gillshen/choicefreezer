<script lang="ts">
	import type { GmatScore } from '$lib/types/testScoreTypes';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: GmatScore;

	const value = data.result ? ((data.result - 200) * 100) / 600 : 0;
</script>

<ScoreCard {data} title="GMAT" {value}>
	<div class="cf-score-key">Verbal</div>
	<ScoreCardValue value={data.verbal} />

	<div class="cf-score-key">Quantitative</div>
	<ScoreCardValue value={data.quant} />

	<div class="cf-score-key">Reasoning</div>
	<ScoreCardValue value={data.reasoning} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing} />
</ScoreCard>
