<script lang="ts">
	import { toMonthYear } from '$lib/utils/dateUtils';
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let subject: string;
	export let value: number | null;
	export let max: number;
	export let date: string | null;
	export let grade: string | number | null | undefined = undefined;

	if (grade === undefined) {
		grade = value;
	}
</script>

<div class="flex flex-col gap-1">
	<div class="text-surface-300 mr-auto">{subject}</div>
	<div class="grid grid-cols-[auto_1fr_68px] gap-x-4 items-center">
		<div
			class="text-lg font-bold w-8 h-8 flex justify-center items-center rounded-full border border-primary-400/40"
		>
			{grade ?? ''}
		</div>
		<ProgressBar
			value={value ?? 0}
			{max}
			height="h-1"
			meter="bg-primary-400"
			track="bg-surface-500/30"
		/>
		<div class="text-surface-300 text-sm">
			{date ? toMonthYear(date) : 'Undated'}
		</div>
	</div>
</div>
