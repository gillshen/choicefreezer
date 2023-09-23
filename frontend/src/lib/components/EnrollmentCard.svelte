<script lang="ts">
	import type { EnrollmentListItem } from '$lib/types/enrollmentTypes';
	import {
		HIGH_SCHOOL_PROGRESSIONS,
		MASTER_PROGRESSIONS,
		UG_PROGRESSIONS
	} from '$lib/constants/progressions';
	import { TERMS } from '$lib/constants/terms';
	import { toMonthYear } from '$lib/utils/dateUtils';
	import {
		abbreviateProgression,
		formatProgression,
		formatTermType
	} from '$lib/utils/enrollmentUtils';
	import { byTermDescCumulativeFirst } from '$lib/utils/sortUtils';

	export let enrollment: EnrollmentListItem;

	const terms = [...Array.from(TERMS), 'Academic Year'].reverse();

	let targetClass: string;
	let progressions: string[];

	switch (enrollment.program_type) {
		case 'Pre-College':
			targetClass = 'ug-freshman';
			progressions = Array.from(HIGH_SCHOOL_PROGRESSIONS);
			break;
		case 'UG Freshman':
		case 'UG Transfer':
			progressions = Array.from(UG_PROGRESSIONS);
			targetClass = 'graduate';
			break;
		case 'Master':
			progressions = Array.from(MASTER_PROGRESSIONS);
			targetClass = 'graduate';
			break;
		default:
			progressions = [];
			targetClass = 'other';
	}
</script>

<a
	href={`/attendances/${enrollment.id}/`}
	class={`enrollment-card border-t-2 border-${targetClass}`}
>
	<header class="p-4 font-bold text-surface-50">
		{enrollment.school.name}
	</header>

	<div class="p-4 grid grid-cols-2 gap-x-4">
		<div>
			<div class="cf-entry-label mb-1">From</div>
			<div>
				{toMonthYear(enrollment.start_date)}
				({abbreviateProgression(enrollment.starting_progression)})
			</div>
		</div>

		<div>
			<div class="cf-entry-label mb-1">To</div>
			<div>
				{#if enrollment.end_date && enrollment.ending_progression}
					{toMonthYear(enrollment.end_date)}
					({abbreviateProgression(enrollment.ending_progression)})
				{:else if enrollment.end_date && !enrollment.ending_progression}
					{toMonthYear(enrollment.end_date)}
				{:else if !enrollment.end_date && enrollment.ending_progression}
					? ({abbreviateProgression(enrollment.ending_progression)})
				{:else}
					n/a
				{/if}
			</div>
		</div>
	</div>

	{#each progressions.reverse() as progression}
		{#each terms as term}
			{@const grades = enrollment.grades.filter(
				(grade) => grade.progression === progression && grade.term === term
			)}
			{@const classRank = enrollment.class_ranks.find(
				(rank) => rank.progression === progression && rank.term === term
			)}
			{#if grades.length || classRank}
				<div class="flex flex-col px-4 pb-4">
					<div class="cf-entry-label mb-1">
						{formatProgression(progression)} - {term}
					</div>

					<div class="grid grid-cols-2 gap-4">
						{#each grades.sort(byTermDescCumulativeFirst) as gpa}
							<div class="grade-card flex flex-col gap-2">
								<div class="cf-entry-label">{formatTermType(gpa)} GPA</div>
								<div class="flex gap-1 items-baseline my-auto">
									<span
										class={`${
											gpa.is_cumulative ? 'text-primary-400' : 'text-surface-50'
										} text-xl tabular-nums`}>{gpa.value}</span
									>
									<span class="text-surface-200 text-sm">/</span>
									<span class="text-surface-200 text-sm tabular-nums">{gpa.scale}</span>
								</div>
							</div>
						{/each}

						{#if classRank}
							<div class="rank-card flex flex-col gap-2">
								<div class="cf-entry-label">Class rank</div>
								<div class="my-auto">
									{#if classRank.top_x}
										<span class="text-primary-400 text-xl tabular-nums">{classRank.top_x}%</span>
										{#if classRank.class_size}
											<span class="text-surface-200 text-sm tabular-nums">
												of {classRank.class_size}</span
											>
										{/if}
									{:else}
										<div class="flex gap-1 items-baseline">
											<span class="text-primary-400 text-xl tabular-nums">{classRank.rank}</span>
											<span class="text-surface-200 text-sm">/</span>
											<span class="text-surface-200 text-sm tabular-nums"
												>{classRank.class_size}</span
											>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	{/each}
</a>

<style lang="postcss">
	.enrollment-card {
		transition: all 0.2s ease-in-out;
	}
	.enrollment-card:hover {
		@apply bg-surface-700;
	}

	.enrollment-card .grade-card,
	.enrollment-card .rank-card,
	.enrollment-card header {
		@apply bg-surface-700;
		transition: all 0.2s ease-in-out;
	}
	.enrollment-card:hover .grade-card,
	.enrollment-card:hover .rank-card,
	.enrollment-card:hover header {
		@apply bg-surface-600;
	}

	.enrollment-card .grade-card,
	.enrollment-card .rank-card {
		@apply min-h-[64px];
		@apply p-2 rounded-md;
	}
</style>
