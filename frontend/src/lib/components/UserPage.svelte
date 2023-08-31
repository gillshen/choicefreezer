<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import type { User } from '$lib/types/userTypes';
	import type { ApplicationListItem } from '$lib/types/applicationTypes';

	import PageSection from '$lib/components/PageSection.svelte';
	import MinimalRadioGroup from '$lib/components/MinimalRadioGroup.svelte';
	import StudentAnchorCard from '$lib/components/StudentAnchorCard.svelte';
	import { byContractType, byRomanizedName, byTargetYearDesc } from '$lib/utils/studentUtils.js';

	import type { DomLayoutType } from 'ag-grid-community';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';
	import {
		ApplicantRenderer,
		ApplicationIdRenderer,
		ProgramRenderer,
		TargetRenderer,
		StatusRenderer,
		schoolAbbreviationsValueGetter,
		targetValueGetter,
		deadlineValueGetter,
		deadlineValueFormatter
	} from '$lib/utils/applicationGridUtils.js';

	import { BANNER, NO_ROWS_TO_SHOW } from '$lib/constants/messages.js';

	export let data: { username: string; owner: User; applications: ApplicationListItem[] };

	const MAX_ROWS = 15; // A grid with more rows have will have its height restricted

	const applicationColumnDefs = [
		{
			headerName: 'Link',
			field: 'id',
			flex: 0,
			maxWidth: 80,
			filter: false,
			sortable: false,
			minWidth: 50,
			cellRenderer: ApplicationIdRenderer
		},
		{ headerName: 'Student', field: 'student.name', cellRenderer: ApplicantRenderer },
		{ headerName: 'Target', valueGetter: targetValueGetter, cellRenderer: TargetRenderer },
		{ headerName: 'School', valueGetter: schoolAbbreviationsValueGetter },
		{ headerName: 'Program', field: 'program.display_name', cellRenderer: ProgramRenderer },
		{ headerName: 'Admission Plan', field: 'subtarget.admission_plan' },
		{
			headerName: 'Deadline',
			type: ['dateStringColumn'],
			valueGetter: deadlineValueGetter,
			valueFormatter: deadlineValueFormatter
		},
		{ headerName: 'Status', field: 'latest_log.status', cellRenderer: StatusRenderer }
	];

	let filterYearCurrent: number | string = 'All';
	let filterYearPast: number | string = 'All';
	let showPastStudents = false;

	$: owner = data.owner;
	$: userCanEdit = data.username === owner.username;

	// Filtering by latest_target_year values

	// - options for current students
	$: yearOptionsCurrent = Array.from(
		new Set(owner.current_students.map((s) => s.latest_target_year))
	).sort((a, b) => b - a);

	// - options for past students
	$: yearOptionsPast = Array.from(
		new Set(owner.past_students.map((s) => s.latest_target_year))
	).sort((a, b) => b - a);

	$: filteredCurrentStudents =
		filterYearCurrent === 'All'
			? owner.current_students
			: owner.current_students.filter((s) => s.latest_target_year === filterYearCurrent);

	$: filteredPastStudents =
		filterYearPast === 'All'
			? owner.past_students
			: owner.past_students.filter((s) => s.latest_target_year === filterYearPast);

	$: gridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs: applicationColumnDefs,
		rowData: data.applications,
		suppressDragLeaveHidesColumns: true,
		domLayout: data.applications.length > MAX_ROWS ? undefined : ('autoHeight' as DomLayoutType)
	};

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<h1>{owner.public_banner || `${owner.username}${BANNER}`}</h1>

<PageSection>
	<!-- Using custom h2 for the additional top margin -->
	<h2 class="mb-4">Current students</h2>

	<div class="student-grid">
		<div>
			<MinimalRadioGroup bind:target={filterYearCurrent} options={['All', ...yearOptionsCurrent]} />
			{#if userCanEdit}
				<button class="cf-primary mt-4 w-full" on:click={() => goto('../students/new/')}
					>Add a student</button
				>
			{/if}
		</div>

		<div class="student-cards-container">
			{#each filteredCurrentStudents
				.sort(byRomanizedName)
				.sort(byTargetYearDesc)
				.sort(byContractType) as student}
				<StudentAnchorCard {student} />
			{/each}
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Past students</svelte:fragment>

	<button
		class="text-primary-500 hover:text-primary-400"
		on:click={() => (showPastStudents = !showPastStudents)}
	>
		{showPastStudents ? 'Hide' : 'Show'}
		<i class={`toggle-icon fa-solid fa-chevron-down ${showPastStudents ? 'open' : ''}`} />
	</button>

	<div id="past-students-wrapper" class={showPastStudents ? 'open' : ''}>
		<div class="student-grid mt-8">
			<MinimalRadioGroup bind:target={filterYearPast} options={['All', ...yearOptionsPast]} />

			<div class="student-cards-container">
				{#each filteredPastStudents
					.sort(byRomanizedName)
					.sort(byTargetYearDesc)
					.sort(byContractType) as student}
					<StudentAnchorCard {student} lighter />
				{/each}
			</div>
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>

	{#if data.applications.length}
		<div class={`w-full ${data.applications.length > MAX_ROWS ? 'h-[calc(100vh-12rem)]' : ''}`}>
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p class="section-placeholder">{NO_ROWS_TO_SHOW}</p>
	{/if}
</PageSection>

<style lang="postcss">
	.student-grid {
		@apply grid grid-cols-[1fr,_5fr] gap-x-20;
	}
	.student-cards-container {
		@apply grid grid-cols-4;
		@apply gap-7;
		@apply h-fit;
	}
	#past-students-wrapper {
		display: grid;
		grid-template-rows: 0fr;
		overflow: hidden;
		opacity: 0;
		transition: all 0.4s ease-in-out;
	}
	#past-students-wrapper.open {
		grid-template-rows: 1fr;
		opacity: 1;
		/* avoid clipping shadows */
		overflow: visible;
	}
	#past-students-wrapper * {
		min-height: 0;
	}
	.toggle-icon {
		transition: all 0.4s ease-in-out;
	}
	.toggle-icon.open {
		rotate: 180deg;
	}
</style>
