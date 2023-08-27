<script lang="ts">
	import type { ApplicationLog } from '$lib/types/applicationLogTypes';
	import { statusToClass } from '$lib/utils/applicationUtils';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let logs: ApplicationLog[];
</script>

<ol class="relative border-l border-surface-400">
	{#each logs as { status, date, comments, updated }}
		<li class="mb-10 ml-4">
			<div class={`absolute app-status-dot w-4 h-4 mt-[38px] -left-2 ${statusToClass(status)}`} />

			<time class="mb-1 text-sm leading-none text-surface-300">{toShortDate(date)}</time>

			<h3 class="py-2 text-lg text-surface-50 flex gap-4 items-baseline">
				{status}
				<small class="text-surface-500">Updated {toShortDate(updated)}</small>

				<!-- slot for actions -->
				<slot />
			</h3>

			{#each comments.split(/\n+/g) as paragraph}
				<p class="mb-4 max-w-prose text-surface-300">
					{paragraph}
				</p>
			{/each}
		</li>
	{/each}
</ol>
