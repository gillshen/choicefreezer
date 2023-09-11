<script lang="ts">
	import type { GridOptions } from 'ag-grid-community';
	import type { SetVisibleParams } from '$lib/types/gridTypes';
	import { setColumnVisible } from '$lib/utils/gridUtils';

	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let gridOptions: GridOptions;
	export let initialStates: SetVisibleParams[];

	function toggleVisible(headerName: string, e: any) {
		setColumnVisible(gridOptions, { headerName, hide: !e.target.checked });
	}
</script>

<div class="flex flex-col gap-3 text-surface-300">
	{#each initialStates as { headerName, hide }}
		<SlideToggle
			name={headerName}
			checked={!hide}
			active="bg-primary-500"
			size="xs"
			background="bg-surface-500"
			on:change={(e) => toggleVisible(headerName, e)}
		>
			<span class="text-sm font-heading-token">{headerName}</span>
		</SlideToggle>
	{/each}
</div>
