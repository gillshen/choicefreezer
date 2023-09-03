<script lang="ts">
	import type { UserLogListItem } from '$lib/types/userLogTypes';

	export let log: UserLogListItem;
	export let allowEdit: boolean;
	export let handleDeleteRequest: (log: UserLogListItem) => void;
</script>

<li class="px-6 py-4 rounded-xl cf-card-shadow-convex-2">
	<div class="flex justify-between">
		<div class="flex gap-2 items-baseline text-sm text-tertiary-500">
			<time class="">{log.date}</time>

			{#if log.shared}
				<i class="fa-solid fa-bullhorn" />
			{/if}

			{#if log.public && allowEdit}
				<i class="fa-solid fa-eye" />
			{/if}

			{#if log.pinned}
				<i class="fa-solid fa-thumbtack text-rose-400" />
			{/if}
		</div>

		{#if allowEdit}
			<div class="flex">
				<button
					class="icon-button delete text-surface-300"
					on:click={() => handleDeleteRequest(log)}
				>
					<i class="fa-solid fa-trash" />
				</button>
			</div>
		{/if}
	</div>

	<header class="text-base font-bold flex gap-4 items-baseline justify-between">
		<div class="flex gap-2 items-center">
			{#if log.relevant_student}
				<div class="student-chip">{log.relevant_student.name}</div>
			{/if}

			{log.title}
		</div>

		<small class="text-surface-400 font-normal">Updated {log.updated}</small>
	</header>

	{#each log.text.split(/(?:\r?\n){2,}/g) as paragraph}
		<p class="log-text max-w-prose text-surface-300">
			<!-- TODO potentially unsafe -->
			{@html paragraph.split(/\r?\n/g).join('<br />')}
		</p>
	{/each}
</li>

<style lang="postcss">
	.student-chip {
		@apply px-4 py-1 rounded-full;
		@apply font-normal text-sm;
		@apply bg-primary-400 text-surface-900;
	}

	p.log-text:first-of-type {
		@apply pt-2;
	}
	p.log-text:last-of-type {
		@apply pb-2;
	}
</style>
