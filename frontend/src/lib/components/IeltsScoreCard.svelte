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
	<ScoreCardValue value={data.listening} />

	<div class="cf-score-key">Reading</div>
	<ScoreCardValue value={data.reading} />

	<div class="cf-score-key">Writing</div>
	<ScoreCardValue value={data.writing} />

	<div class="cf-score-key">Speaking</div>
	<ScoreCardValue value={data.speaking} />
</ScoreCard>

<!-- <div class="cf-score-card">
	<header class="cf-score-card-header">IELTS</header>

	<div class="mx-auto">
		<ProgressRadial {value} {font} {meter}>{data.result ?? 'n/a'}</ProgressRadial>
	</div>

	<div class="cf-score-card-date">
		{#if data.date}
			{toShortDate(data.date)}
		{:else}
			Undated
		{/if}
	</div>

	<div class="cf-score-card-body">
		
	</div>
</div> -->
