<script lang="ts">
	import { onMount } from 'svelte';

	import type { User } from '$lib/types/userTypes';
	import type { UserLogListItem } from '$lib/types/userLogTypes';
	import type { ApplicationListItem } from '$lib/types/applicationTypes';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewUserLogSchema } from '$lib/schemas';

	import PageSection from '$lib/components/PageSection.svelte';
	import MinimalRadioGroup from '$lib/components/MinimalRadioGroup.svelte';
	import StudentAnchorCard from '$lib/components/StudentAnchorCard.svelte';
	import UserLogCard from './UserLogCard.svelte';
	import UserLogForm from '$lib/forms/UserLogForm.svelte';
	import Dialog from './Dialog.svelte';
	import BinaryDialog from './BinaryDialog.svelte';
	import { byContractType, byRomanizedName, byTargetYearDesc } from '$lib/utils/studentUtils.js';
	import { processLog } from '$lib/utils/userLogUtils';

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

	import { BANNER, NO_ROWS_TO_SHOW, UNKNOWN_ERROR } from '$lib/constants/messages.js';

	import { deleteUserLog } from '$lib/api';
	import { toast } from '$lib/utils/interactiveUtils';
	import { invalidateAll } from '$app/navigation';

	export let data: {
		userId: number;
		username: string;
		owner: User;
		logs: UserLogListItem[];
		userLogForm: SuperValidated<NewUserLogSchema>;
		applications: ApplicationListItem[];
	};

	let logCreateDialog: HTMLDialogElement;
	let logDeleteDialog: HTMLDialogElement;

	let activeLog: UserLogListItem;

	async function handleDeleteLog() {
		const response = await deleteUserLog(activeLog.id);
		if (response.ok) {
			invalidateAll();
			logDeleteDialog.close();
			toast('Log entry deleted', 'success');
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

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
	$: userIsOwner = data.username === owner.username;
	$: banner =
		(data.username === owner.username ? owner.private_banner : owner.public_banner) ||
		`${owner.username}${BANNER}`;

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

	$: logs = data.logs.filter(userIsOwner ? () => true : (log) => log.public || log.shared);

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<h1>{banner}</h1>

<PageSection>
	<div class="student-grid">
		<div class="flex flex-col gap-4">
			{#if userIsOwner}
				<a class="add-student cf-card-shadow-convex" href="../students/new/">
					<i class="fa-solid fa-plus -ml-2" />
					Student</a
				>
			{/if}

			{#if owner.current_students.length}
				<MinimalRadioGroup
					bind:target={filterYearCurrent}
					options={['All', ...yearOptionsCurrent]}
				/>
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

	{#if owner.past_students.length}
		<button
			class="flex gap-2 items-center text-surface-50 hover:text-primary-500 mt-12"
			on:click={() => (showPastStudents = !showPastStudents)}
		>
			Past students
			<i class={`toggle-icon fa-solid fa-chevron-right ${showPastStudents ? 'open' : ''}`} />
		</button>
	{/if}

	<div id="past-students-wrapper" class={showPastStudents ? 'open' : ''}>
		<div class="student-grid mt-8">
			<MinimalRadioGroup bind:target={filterYearPast} options={['All', ...yearOptionsPast]} />

			<div class="student-cards-container">
				{#each filteredPastStudents
					.sort(byRomanizedName)
					.sort(byTargetYearDesc)
					.sort(byContractType) as student}
					<StudentAnchorCard {student} />
				{/each}
			</div>
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Logs</svelte:fragment>

	<div class="logs-grid">
		<div class="flex flex-col gap-4">
			TODO: Filters

			{#if userIsOwner}
				<button class="cf-primary" on:click={() => logCreateDialog.showModal()}>Add an entry</button
				>
			{/if}
		</div>

		{#if data.logs.length}
			<div>
				<div class="top-mask" />
				<ol class="scrollable flex flex-col gap-4 pl-4 pr-12 py-8 rounded-xl">
					{#each logs.map(processLog) as log}
						<UserLogCard
							{log}
							allowEdit={userIsOwner}
							handleDeleteRequest={(log) => {
								activeLog = log;
								logDeleteDialog.showModal();
							}}
						/>
					{/each}
				</ol>
				<div class="bottom-mask" />
			</div>
		{/if}
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

<Dialog title="Add a log entry" exitHelper bind:dialog={logCreateDialog}>
	<UserLogForm
		bind:dialog={logCreateDialog}
		data={data.userLogForm}
		action="../home?/createLog"
		userId={data.userId}
		students={[...owner.current_students, ...owner.past_students]}
	/>
</Dialog>

<BinaryDialog
	bind:dialog={logDeleteDialog}
	title="Delete this log entry?"
	onYes={handleDeleteLog}
	dangerous
/>

<style lang="postcss">
	.student-grid,
	.logs-grid {
		@apply grid grid-cols-[1fr_5fr] gap-x-20;
	}

	.student-cards-container {
		@apply grid grid-cols-4;
		@apply gap-7;
		@apply h-fit;
	}

	.add-student {
		@apply btn bg-surface-900 text-primary-500;
		@apply h-[64px] w-[169px];
		@apply rounded-full;
		@apply flex gap-2 items-center;
	}

	.logs-grid .scrollable {
		@apply max-h-[calc(100vh-144px)] overflow-auto;
	}
	.log-bullet {
		@apply absolute;
		@apply w-4 h-4 mt-[38px] -left-2 rounded-full;
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
		rotate: 90deg;
	}

	.top-mask,
	.bottom-mask {
		@apply relative;
	}
	.top-mask::after,
	.bottom-mask::before {
		@apply absolute h-8 w-full;
		@apply z-10;
		width: calc(100% - 2rem); /* avoid masking the scrollbar */
		content: '';
	}
	.top-mask::after {
		background: linear-gradient(#373737, rgba(255, 255, 255, 0));
	}
	.bottom-mask::before {
		margin-top: -2rem;
		background: linear-gradient(rgba(255, 255, 255, 0), #373737);
	}
</style>
