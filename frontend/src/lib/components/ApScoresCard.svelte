<script lang="ts">
	import type { ApScore } from '$lib/types/testScoreTypes';
	import SubjectScoreCard from './SubjectScoreCard.svelte';

	export let data: ApScore[];
</script>

<div class="cf-score-card collection">
	<header class="cf-score-card-header">AP</header>

	<div class="cf-score-card-body collection">
		{#each data as apScore}
			<SubjectScoreCard data={apScore} />
		{/each}
	</div>
</div>
