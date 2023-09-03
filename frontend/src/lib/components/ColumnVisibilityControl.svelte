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

<div class="flex flex-col gap-2 text-surface-300">
	{#each initialStates as { headerName, hide }}
		<SlideToggle
			name={headerName}
			checked={!hide}
			active="bg-primary-500"
			size="sm"
			on:change={(e) => toggleVisible(headerName, e)}
		>
			{headerName}
		</SlideToggle>
	{/each}
</div>
