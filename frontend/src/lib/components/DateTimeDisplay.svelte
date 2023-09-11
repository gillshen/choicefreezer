<script lang="ts">
	import { formatTimezone, toShortDateWithoutYear, toYear, toTime } from '$lib/utils/dateUtils';

	export let date: string | null;
	export let time: string | null = null;
	export let timezone: string = '';
	export let placeholder: string = '?';
</script>

{#if date}
	<div class="flex flex-col gap-2">
		<div class="flex gap-4 items-baseline">
			<div class="text-3xl font-bold tracking-wide">{toShortDateWithoutYear(date)}</div>
			<div class="font-bold">{toYear(date)}</div>
		</div>
		{#if time}
			<div class="text-surface-300">
				{toTime(time)}
				{#if timezone}{formatTimezone(timezone)}{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class="text-5xl font-bold text-center mt-1">{placeholder}</div>
{/if}
