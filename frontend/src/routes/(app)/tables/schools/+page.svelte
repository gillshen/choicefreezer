<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions, ICellRendererParams } from 'ag-grid-community';

	import type { ColumnControls } from '$lib/types/gridTypes.js';
	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';
	import ColumnVisibilityControl from '$lib/components/ColumnVisibilityControl.svelte';

	import { defaultColDef, columnTypes, mountGrid, AgCellRenderer } from '$lib/utils/gridUtils.js';

	export let data;
	const { schools } = data;

	class NameRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `../schools/${params.data.id}/`;
			this.eGui.innerHTML = params.data.name;
		}
	}

	const columnControls: ColumnControls = {
		type: { headerName: 'Type', hide: false },
		school: { headerName: 'School', hide: false },
		abbreviation: { headerName: 'Abbreviation', hide: false },
		country: { headerName: 'Country', hide: true },
		usNewsRank: { headerName: 'US News Rank', hide: false },

		applied: { headerName: '# Applied', hide: false },
		resultPending: { headerName: '# Result Pending', hide: true },

		admitted: { headerName: '# All Admitted', hide: false },
		deferAdmitted: { headerName: '# Adm. after deferral', hide: true },
		waitlistAdmitted: { headerName: '# Adm. from WL', hide: true },

		rejected: { headerName: '# All Rejected', hide: false },
		deferRejected: { headerName: '# Rej. after deferral', hide: true },
		waitlistRejected: { headerName: '# Rej. from WL', hide: true },

		deferred: { headerName: '# All Deferred', hide: true },
		waitlisted: { headerName: '# All Waitlisted', hide: true },

		admitRate: { headerName: 'Admit Rate', hide: false }
	};

	const columnDefs = [
		{ ...columnControls.type, field: 'type' },
		{ ...columnControls.school, field: 'name', minWidth: 240, cellRenderer: NameRenderer },
		{ ...columnControls.abbreviation, field: 'abbreviation' },
		{ ...columnControls.country, field: 'country' },
		{ ...columnControls.usNewsRank },

		{ ...columnControls.applied, type: ['numberColumn', 'numberApplied'] },
		{ ...columnControls.resultPending, type: ['numberColumn', 'numberResultPending'] },

		{ ...columnControls.admitted, type: ['numberColumn', 'numberAdmitted'] },
		{ ...columnControls.deferAdmitted, type: ['numberColumn', 'numberDeferAdmitted'] },
		{ ...columnControls.waitlistAdmitted, type: ['numberColumn', 'numberWaitlistAdmitted'] },

		{ ...columnControls.rejected, type: ['numberColumn', 'numberRejected'] },
		{ ...columnControls.deferRejected, type: ['numberColumn', 'numberDeferRejected'] },
		{ ...columnControls.waitlistRejected, type: ['numberColumn', 'numberWaitlistRejected'] },

		{ ...columnControls.deferred, type: ['numberColumn', 'numberDeferred'] },
		{ ...columnControls.waitlisted, type: ['numberColumn', 'numberWaitlisted'] },

		{ ...columnControls.admitRate, type: ['numberColumn', 'admitRate'] }
	];

	const gridOptions: GridOptions = {
		defaultColDef: { ...defaultColDef, maxWidth: undefined },
		columnTypes,
		columnDefs,
		rowData: schools,
		suppressDragLeaveHidesColumns: true
	};

	onMount(() => mountGrid('#grid', gridOptions));
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<ColumnVisibilityControl {gridOptions} initialStates={Object.values(columnControls)} />
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title flex justify-between">
			Schools
			<GridDownloadButton {gridOptions} />
		</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />
	</div>
</div>
