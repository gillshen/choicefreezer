<script lang="ts">
	import type { AlevelGrade } from '$lib/types/testScoreTypes';
	import SubjectScoreCard from './SubjectScoreCard.svelte';

	export let data: AlevelGrade[];
	export let gradesType: 'predicted' | 'final';
</script>

<div class="cf-score-card collection">
	<header class="cf-score-card-header">A Level {gradesType}</header>

	<div class="cf-score-card-body collection">
		{#each data as { subject, percentage, grade, date }}
			<SubjectScoreCard {subject} {grade} value={percentage} max={100} {date} />
		{/each}
	</div>
</div>
