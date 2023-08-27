<script lang="ts">
	import type { ApplicationLog } from '$lib/types/applicationLogTypes';
	import { statusToClass } from '$lib/utils/applicationUtils';

	export let logs: ApplicationLog[];
</script>

<ol class="relative border-l border-surface-400">
	{#each logs as { status, date, comments, updated }}
		<li class="mb-10 ml-4">
			<div class={`absolute app-status-dot w-4 h-4 mt-[38px] -left-2 ${statusToClass(status)}`} />

			<time class="mb-1 text-sm font-normal leading-none text-surface-400">{date}</time>

			<h3 class="py-2 text-lg text-surface-50 flex gap-2 items-center">
				{status}
				<small class="text-surface-500 ml-2">Updated {updated}</small>
			</h3>

			{#each comments.split(/\n+/g) as paragraph}
				<p class="mb-4 max-w-prose text-base font-normal text-surface-400">
					{paragraph}
				</p>
			{/each}
		</li>
	{/each}
</ol>
