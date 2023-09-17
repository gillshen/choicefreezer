<script lang="ts">
	import type { IbGrade } from '$lib/types/testScoreTypes';
	import SubjectScoreCard from './SubjectScoreCard.svelte';

	export let data: IbGrade[];
	export let gradesType: 'predicted' | 'final';
</script>

<div class="cf-score-card collection">
	<header class="cf-score-card-header">IB {gradesType}</header>

	<div class="cf-score-card-body collection">
		{#each data as ibGrade}
			<SubjectScoreCard data={ibGrade} gradeType={gradesType} />
		{/each}
	</div>
</div>
