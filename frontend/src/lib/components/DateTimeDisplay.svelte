<script lang="ts">
	import { formatTimezone, toShortDate, toTime } from '$lib/utils/dateUtils';
	export let date: string | null;
	export let time: string | null = null;
	export let timezone: string = '';
	export let placeholder: string = '?';
</script>

{#if date}
	<div class="flex flex-col gap-2">
		<div class="text-2xl font-bold">
			{toShortDate(date)}
		</div>
		{#if time}
			<div class="flex gap-1">
				<div>{toTime(time)}</div>
				{#if timezone}
					<div>{formatTimezone(timezone)}</div>
				{/if}
			</div>
		{/if}
	</div>
{:else}
	<div class="text-5xl font-bold flex justify-center items-center">{placeholder}</div>
{/if}
