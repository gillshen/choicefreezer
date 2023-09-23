<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions, ICellRendererParams } from 'ag-grid-community';

	import type { ColumnControls } from '$lib/types/gridTypes.js';
	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';
	import ColumnVisibilityControl from '$lib/components/ColumnVisibilityControl.svelte';

	import { defaultColDef, columnTypes, mountGrid, AgCellRenderer } from '$lib/utils/gridUtils.js';
	import Section from '$lib/components/Section.svelte';

	export let data;
	const { schools } = data;

	class NameRenderer extends AgCellRenderer {
		declare eGui: HTMLAnchorElement;

		init(params: ICellRendererParams<any, any, any>): void {
			this.eGui = document.createElement('a');
			this.eGui.href = `/schools/${params.data.id}`;
			this.eGui.innerHTML = params.data.name;
		}
	}

	const columnControls: ColumnControls = {
		type: { headerName: 'Type', hide: false },
		name: { headerName: 'Name', hide: false },
		abbreviation: { headerName: 'Abbreviation', hide: false },
		country: { headerName: 'Home Country', hide: true },
		usNewsRank: { headerName: 'US News Rank', hide: false },

		applied: { headerName: 'Num. Applied', hide: false },
		resultPending: { headerName: 'Num. Pending', hide: true },

		admitted: { headerName: 'Num. Admitted Total', hide: false },
		deferAdmitted: { headerName: 'Num. Deferred-Admitted', hide: true },
		waitlistAdmitted: { headerName: 'Num. WL-Admitted', hide: true },

		rejected: { headerName: 'Num. Rejected Total', hide: false },
		deferRejected: { headerName: 'Num. Deferred-Rejected', hide: true },
		waitlistRejected: { headerName: 'Num. WL-Rejected', hide: true },

		deferred: { headerName: 'Num. Deferred Total', hide: true },
		waitlisted: { headerName: 'Num. Waitlisted Total', hide: true },

		admitRate: { headerName: 'Admit Rate', hide: false }
	};

	const columnDefs = [
		{ ...columnControls.type, field: 'type' },
		{ ...columnControls.name, field: 'name', cellRenderer: NameRenderer },
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

<Section hero wide classNames="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<ColumnVisibilityControl {gridOptions} initialStates={Object.values(columnControls)} />
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">
			Schools
			<GridDownloadButton {gridOptions} />
		</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />
	</div>
</Section>
