<script lang="ts">
	import type { GridOptions } from 'ag-grid-community';

	export let gridOptions: GridOptions;

	function exportCsv() {
		gridOptions.api?.exportDataAsCsv();
	}
</script>

<button class="btn cf-btn cf-secondary" on:click={exportCsv}
	><i class="fa-solid fa-download" />Download</button
>
