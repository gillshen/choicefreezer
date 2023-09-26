<script lang="ts">
	import type { UserLogListItem } from '$lib/types/userLogTypes';
	import { toShortTime } from '$lib/utils/dateUtils';
	import Paragraphs from './Paragraphs.svelte';

	export let log: UserLogListItem;
	export let allowEdit: boolean;
	export let handleTodoToggleRequest: (log: UserLogListItem) => void;
	export let handlePinToggleRequest: (log: UserLogListItem) => void;
	export let handleDeleteRequest: (log: UserLogListItem) => void;

	let open = false;

	$: isTodo = log.task_status === 'TODO';

	$: iconClass = isTodo
		? 'fa-solid fa-hourglass-start'
		: log.task_status === 'Done'
		? 'fa-solid fa-check'
		: log.shared
		? 'fa-solid fa-bullhorn'
		: log.pinned
		? 'fa-solid fa-thumbtack'
		: 'fa-regular fa-note-sticky';

	$: iconColor = log.pinned
		? 'text-orange-400'
		: log.task_status === 'TODO'
		? 'text-warning-400'
		: log.task_status === 'Done'
		? 'text-success-400'
		: 'text-surface-400';
</script>

<button
	class="text-base w-full font-bold my-1 flex items-center justify-between"
	on:click={() => (open = !open)}
>
	<div class="w-[32px] flex justify-center">
		<i class={`${iconClass} ${iconColor}`} />
	</div>

	<div class="flex-grow flex gap-2 items-baseline ml-4">
		<span class={`${open ? 'font-bold' : 'font-normal'}`}>{log.title}</span>

		{#if log.relevant_student}
			<div class="student-chip scale-90 whitespace-nowrap overflow-hidden text-ellipsis">
				{log.relevant_student.name}
			</div>
		{/if}
	</div>

	<div class="flex gap-4 items-center pr-1">
		<time class="text-sm text-surface-300 font-normal">
			{#if log.task_due}{toShortTime(log.task_due)}, {/if}{log.date}
		</time>

		<i
			class={`fa-solid fa-chevron-down text-surface-300 ${open ? 'rotate-180' : ''} transition-all`}
		/>
	</div>
</button>

<div class={`log-text-container ${open ? 'open' : ''}`}>
	{#if open}
		<Paragraphs paragraphs={log.text} textClass="text-surface-300 mx-[32px] first-of-type:mt-2" />
	{/if}

	{#if allowEdit && open}
		<div class="flex gap-4 pl-[32px]">
			{#if log.task_status}
				<button
					class={`cf-btn py-1 flex gap-1 items-center ${
						isTodo
							? 'text-primary-400 hover:text-primary-500'
							: 'text-warning-400 hover:text-warning-500'
					} `}
					on:click={() => handleTodoToggleRequest(log)}
				>
					<i class={`text-xs fa-solid ${isTodo ? 'fa-check' : 'fa-hourglass-start'}`} />
					<span class="text-xs">Mark as {isTodo ? 'Done' : 'TODO'}</span>
				</button>
			{/if}

			<button
				class={`cf-btn py-1 flex gap-1 items-center ${
					log.pinned
						? 'text-surface-300 hover:text-surface-100'
						: 'text-orange-400 hover:text-orange-500'
				} `}
				on:click={() => handlePinToggleRequest(log)}
			>
				<i class="text-xs fa-solid fa-thumbtack" />
				<span class="text-xs">{log.pinned ? 'Unpin' : 'Pin'}</span>
			</button>

			<button
				class="cf-btn text-error-400 py-1 hover:text-error-500"
				on:click={() => handleDeleteRequest(log)}
			>
				<span class="text-xs">Delete</span>
			</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	.student-chip {
		@apply px-3 py-1 rounded-full;
		@apply font-normal text-sm;
		@apply bg-primary-400 text-surface-900;
	}

	.log-text-container {
		display: grid;
		grid-template-rows: 0fr;
		row-gap: 0rem;
		overflow: hidden;
		opacity: 0;
		transition: all 0.15s ease-in-out;
	}
	.log-text-container.open {
		grid-template-rows: 1fr;
		row-gap: 1.5rem;
		opacity: 1;
		padding-bottom: 1rem;
	}
	.log-text-container * {
		min-height: 0;
		margin-top: 0;
		margin-bottom: 0;
		padding-top: 0;
		padding-bottom: 0;
	}

	.log-text-paragraph:first-of-type {
		@apply mt-2;
	}
</style>
