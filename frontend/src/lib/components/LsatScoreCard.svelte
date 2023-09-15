<script lang="ts">
	import type { LsatScore } from '$lib/types/testScoreTypes';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: LsatScore;

	const value = data.result ? ((data.result - 120) * 100) / 60 : 0;
</script>

<ScoreCard {data} title="LSAT" {value}>
	<div class="cf-score-key">Total</div>
	<ScoreCardValue value={data.total} />
</ScoreCard>
