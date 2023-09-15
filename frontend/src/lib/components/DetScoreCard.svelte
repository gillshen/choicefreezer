<script lang="ts">
	import type { DetScore } from '$lib/types/testScoreTypes';
	import ScoreCard from './ScoreCard.svelte';
	import ScoreCardValue from './ScoreCardValue.svelte';

	export let data: DetScore;

	const value = data.result ? ((data.result - 70) * 100) / 90 : 0;
</script>

<ScoreCard {data} title="DET" {value}>
	<div class="cf-score-key">Literacy</div>
	<ScoreCardValue value={data.literacy} />

	<div class="cf-score-key">Comprehension</div>
	<ScoreCardValue value={data.comprehension} />

	<div class="cf-score-key">Conversation</div>
	<ScoreCardValue value={data.conversation} />

	<div class="cf-score-key">Production</div>
	<ScoreCardValue value={data.production} />
</ScoreCard>
