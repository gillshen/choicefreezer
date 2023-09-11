<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridOptions } from 'ag-grid-community';

	import type { ColumnControls } from '$lib/types/gridTypes.js';
	import GridDownloadButton from '$lib/components/GridDownloadButton.svelte';
	import ColumnVisibilityControl from '$lib/components/ColumnVisibilityControl.svelte';

	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';

	import {
		LinkRenderer,
		SchoolsRenderer,
		TargetsRenderer,
		schoolsValueGetter,
		targetsValueGetter
	} from '$lib/utils/programGridUtils.js';

	import { byType } from '$lib/utils/sortUtils.js';
	import Section from '$lib/components/Section.svelte';

	export let data;
	const { programs } = data;

	const columnControls: ColumnControls = {
		link: { headerName: 'Link', hide: false },
		type: { headerName: 'Type', hide: false },
		schools: { headerName: 'Host School', hide: false },
		name: { headerName: 'Name', hide: false },
		cfRank: { headerName: 'CF Rank', hide: true },
		targets: { headerName: 'Targets', hide: false },

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
		{
			...columnControls.link,
			field: 'id',
			flex: 0,
			maxWidth: 80,
			filter: false,
			sortable: false,
			minWidth: 50,
			cellRenderer: LinkRenderer
		},
		{ ...columnControls.type, field: 'type' },
		{
			...columnControls.schools,
			valueGetter: schoolsValueGetter,
			cellRenderer: SchoolsRenderer
		},
		{ ...columnControls.name, field: 'display_name' },
		{ ...columnControls.cfRank },
		{ ...columnControls.targets, valueGetter: targetsValueGetter, cellRenderer: TargetsRenderer },

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
		rowData: programs.sort(byType),
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
			Programs
			<GridDownloadButton {gridOptions} />
		</h1>

		<div id="grid" class="data-grid ag-theme-alpine-dark" />
	</div>
</Section>
