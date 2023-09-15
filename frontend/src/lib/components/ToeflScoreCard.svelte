<script lang="ts">
	import type { ToeflScore } from '$lib/types/testScoreTypes';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: ToeflScore;

	const value = data.result ? ((data.result - 60) * 100) / 60 : 0;
</script>

<ScoreCard {data} title="TOEFL" {value}>
	<div class="cf-score-key">Reading</div>
	<ScoreCardValue value={data.reading} />

	<div class="cf-score-key">Listening</div>
	<ScoreCardValue value={data.listening} />

	<div class="cf-score-key">Speaking</div>
	<ScoreCardValue value={data.speaking} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing} />
</ScoreCard>
