<script lang="ts">
	import type {
		ActScore,
		DetScore,
		GmatScore,
		GreScore,
		IeltsScore,
		LsatScore,
		SatScore,
		ToeflScore
	} from '$lib/types/testScoreTypes';
	import { toShortDate } from '$lib/utils/dateUtils';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let data:
		| ToeflScore
		| IeltsScore
		| DetScore
		| SatScore
		| ActScore
		| GreScore
		| GmatScore
		| LsatScore;
	export let title: string;
	export let value: number; // percentage point
	export let font = 80;
	export let meter = 'stroke-primary-400';
</script>

<div class="cf-score-card">
	<header class="cf-score-card-header">{title}</header>

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
		<slot />
	</div>
</div>
