<script lang="ts">
	import type { SatScore } from '$lib/types/testScoreTypes';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: SatScore;

	const value = data.result ? ((data.result - 400) * 100) / 1200 : 0;
</script>

<ScoreCard {data} title="SAT" {value}>
	<div class="cf-score-key">EBRW</div>
	<ScoreCardValue value={data.ebrw} />

	<div class="cf-score-key">Math</div>
	<ScoreCardValue value={data.math} />
</ScoreCard>
