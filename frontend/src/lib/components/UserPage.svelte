<script lang="ts">
	import { onMount } from 'svelte';

	import type { User } from '$lib/types/userTypes';
	import type { UserLogListItem } from '$lib/types/userLogTypes';
	import type { ApplicationListItem } from '$lib/types/applicationTypes';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewUserLogSchema } from '$lib/schemas';

	import Section from './Section.svelte';
	import UserLogCard from './UserLogCard.svelte';
	import UserLogForm from '$lib/forms/UserLogForm.svelte';
	import Dialog from './Dialog.svelte';
	import BinaryDialog from './BinaryDialog.svelte';
	import { byContractType, byRomanizedName, byTargetYearDesc } from '$lib/utils/studentUtils.js';
	import {
		countTasksDone,
		countTasksTodo,
		filterLogByCategory,
		filterLogByDate,
		processLog
	} from '$lib/utils/userLogUtils';

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

	import { BANNER, NONE_AT_THE_MOMENT, UNKNOWN_ERROR } from '$lib/constants/messages.js';

	import { deleteUserLog, patchUserLog } from '$lib/api';
	import { toast } from '$lib/utils/interactiveUtils';
	import { invalidateAll } from '$app/navigation';
	import { typeToClass } from '$lib/utils/contractUtils';

	export let data: {
		userId: number;
		username: string;
		owner: User;
		logs: UserLogListItem[];
		userLogForm: SuperValidated<NewUserLogSchema>;
		applications: ApplicationListItem[];
	};

	// Logs CRUD

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

	async function handleToggleLogTodoStatus(log: UserLogListItem) {
		const response = await patchUserLog(log.id, {
			task_status: log.task_status === 'TODO' ? 'Done' : 'TODO'
		});
		if (response.ok) {
			invalidateAll();
			toast('Task status updated', 'success');
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	async function handleToggleLogPinStatus(log: UserLogListItem) {
		const response = await patchUserLog(log.id, { pinned: !log.pinned });
		if (response.ok) {
			invalidateAll();
			toast(`Log ${log.pinned ? 'unpinned' : 'pinned'}`, 'success');
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	// The applications grid

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

	// Data and filtering

	$: owner = data.owner;
	$: userIsOwner = data.username === owner.username;
	$: banner =
		(userIsOwner ? owner.private_banner : owner.public_banner) || `${owner.username}${BANNER}`;

	// Filtering by latest_target_year values
	let showPastStudents = false;
	let yearFilter: number | string = 'All';

	$: yearOptions = showPastStudents
		? Array.from(new Set(owner.past_students.map((s) => s.latest_target_year))).sort(
				(a, b) => b - a
		  )
		: Array.from(new Set(owner.current_students.map((s) => s.latest_target_year))).sort(
				(a, b) => b - a
		  );

	$: filteredStudents = showPastStudents
		? owner.past_students.filter((s) => yearFilter === 'All' || s.latest_target_year === yearFilter)
		: owner.current_students.filter(
				(s) => yearFilter === 'All' || s.latest_target_year === yearFilter
		  );

	$: gridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs: applicationColumnDefs,
		rowData: data.applications,
		suppressDragLeaveHidesColumns: true,
		domLayout: data.applications.length > MAX_ROWS ? undefined : ('autoHeight' as DomLayoutType)
	};

	let logDateFilter: string | null = 'Last 7 days';
	let logStudentfilter: number | null = null; // student id or null
	let logCategoryFilter: string | null = null;

	$: filteredLogs = data.logs.filter(
		(log) =>
			(logDateFilter === null ? true : filterLogByDate(log, logDateFilter)) &&
			(logStudentfilter === null ? true : log.relevant_student?.id === logStudentfilter) &&
			(logCategoryFilter === null ? true : filterLogByCategory(log, logCategoryFilter))
	);

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<Section hero>
	<h1 class="cf-h1">{banner}</h1>

	<div class="grid grid-cols-2 gap-12 h-full max-h-[960px]">
		<!-- left panel -->

		<article class="panel">
			<!-- if the owner has any students, show the filters -->
			{#if owner.current_students.length || owner.past_students.length}
				<!-- filters -->
				<div class="flex items-center px-8 pt-4 pb-4">
					<!-- current/past filter -->
					<div class="flex flex-wrap gap-6 pr-4 w-[160px]">
						<button
							class={`tab ${showPastStudents ? '' : 'checked'}`}
							on:click={() => (showPastStudents = false)}>Current</button
						>
						<button
							class={`tab ${showPastStudents ? 'checked' : ''}`}
							on:click={() => (showPastStudents = true)}>Past</button
						>
					</div>

					<!-- year filter -->
					<div class="flex-1 pl-4 pr-8">
						<ul class="flex flex-wrap gap-4">
							{#each ['All', ...yearOptions] as year}
								<li>
									<button
										class={`secondary-tab ${yearFilter === year ? 'checked' : ''}`}
										on:click={() => (yearFilter = year)}>{year}</button
									>
								</li>
							{/each}
						</ul>
					</div>
				</div>

				<!-- students list -->
				<ul
					class="flex-grow -ml-4 mr-8 grid grid-cols-2 gap-y-1 gap-x-6 auto-rows-min px-8 pb-4 overflow-auto"
				>
					{#each filteredStudents
						.sort(byRomanizedName)
						.sort(byTargetYearDesc)
						.sort(byContractType) as student}
						<li class="py-2 px-4 w-full rounded-full hover:bg-surface-700">
							<a href={`../students/${student.id}/`} class="flex items-baseline gap-2">
								<i
									class={`fa-regular fa-folder text-${typeToClass(student.latest_contract_type)}`}
								/>
								<span class="whitespace-nowrap overflow-hidden text-ellipsis">{student.name}</span>
								{#if student.first_name !== student.first_name_romanized}
									<span
										class="flex-shrink text-surface-300 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
										>{student.first_name_romanized}</span
									>
								{/if}
							</a>
						</li>
					{/each}
				</ul>

				{#if userIsOwner}
					<footer class="flex justify-between h-[72px]">
						<a
							href="../students/new/"
							class="cf-btn flex gap-2 items-center p-8 pt-4 text-primary-400 hover:text-primary-500"
						>
							Add another<i class="fa-solid fa-arrow-right-long" />
						</a>
					</footer>
				{/if}
			{:else if userIsOwner}
				<!-- show the CTA -->
				<div class="flex flex-col gap-8 p-8">
					<p class="text-surface-200">You do not have any students under your name.</p>
					<a
						href="../students/new/"
						class="btn cf-btn cf-primary max-w-fit flex gap-2 items-center !bg-primary-500"
					>
						Add a student<i class="fa-solid fa-arrow-right-long" />
					</a>
				</div>
			{:else}
				<!-- show the void card -->
				<div class="void">
					Like birds who, having fed, to the woods repair,<br />
					They leave the landscape desolate and bare.
				</div>
			{/if}
		</article>

		<!-- right panel -->
		<article class="panel">
			<!-- if the log book is not empty, show the entries and the filters -->
			{#if data.logs.length}
				<!-- filters -->
				<div class="flex gap-4 justify-between px-8 pt-4 pb-2">
					<select
						id="log-dates-select"
						class={`select !pl-3 !max-w-40 text-sm ${
							logDateFilter ? 'text-surface-200' : 'text-surface-400'
						}`}
						bind:value={logDateFilter}
					>
						<option value={null} class="text-surface-400">By date...</option>
						{#each [7, 15, 30] as nDays}
							<option value={`Last ${nDays} days`} class="text-sm text-surface-200"
								>{`Last ${nDays} days`}</option
							>
						{/each}
					</select>

					<select
						id="log-student-select"
						class={`select !pl-3 !max-w-40 text-sm ${
							logStudentfilter ? 'text-surface-200' : 'text-surface-400'
						}`}
						bind:value={logStudentfilter}
					>
						<option value={null} class="text-surface-400">By student...</option>
						{#each [...owner.current_students.sort(byRomanizedName), '- Past students -', ...owner.past_students.sort(byRomanizedName)] as student}
							{#if typeof student === 'string'}
								<option value={null} disabled>{student}</option>
							{:else}
								<option value={student.id} class="text-sm text-surface-200">{student.name}</option>
							{/if}
						{/each}
					</select>

					<select
						id="log-category-select"
						class={`select !pl-3 !max-w-40 text-sm ${
							logCategoryFilter ? 'text-surface-200' : 'text-surface-400'
						}`}
						bind:value={logCategoryFilter}
					>
						<option value={null} class="text-surface-400">By category...</option>
						{#each ['TODO', 'Done', 'Shared', 'None of the above'] as category}
							<option value={category} class="text-sm text-surface-200">{category}</option>
						{/each}
					</select>
				</div>

				<!-- entries -->
				{#if filteredLogs.length}
					<ol class="flex-grow ml-8 mr-5 flex-1 flex flex-col overflow-auto">
						{#each filteredLogs.map(processLog) as log}
							<li class="py-2 pr-1 mr-3 border-b border-surface-600 hover:bg-surface-700">
								<UserLogCard
									{log}
									allowEdit={userIsOwner}
									handleDeleteRequest={(log) => {
										activeLog = log;
										logDeleteDialog.showModal();
									}}
									handlePinToggleRequest={handleToggleLogPinStatus}
									handleTodoToggleRequest={handleToggleLogTodoStatus}
								/>
							</li>
						{/each}
					</ol>
				{:else}
					<p class="flex-grow mt-4 mx-8">No entry in this category</p>
				{/if}

				<footer class="flex justify-between h-[72px]">
					{#if userIsOwner}
						<button
							class="cf-btn cursor-pointer flex gap-2 items-center p-8 pt-4 text-primary-400 hover:text-primary-500"
							on:click={() => logCreateDialog.showModal()}
							>Add an entry
						</button>
					{/if}

					<div class="ml-auto mr-6 flex gap-4 justify-end items-center text-sm text-surface-300">
						<div>
							<i class="fa-solid fa-hourglass-start mr-1" />
							<span>{countTasksTodo(data.logs)}</span>
						</div>
						<div>
							<i class="fa-solid fa-check mr-1" />
							<span>{countTasksDone(data.logs)}</span>
						</div>
					</div>
				</footer>
			{:else if userIsOwner}
				<!-- show the CTA -->
				<div class="flex flex-col gap-8 p-8">
					<p class="text-surface-200 max-w-xs">Your log book is empty.</p>
					<button
						class="btn cf-btn cf-primary max-w-fit flex gap-2 items-center !bg-primary-500"
						on:click={() => logCreateDialog.showModal()}
					>
						Add an entry
					</button>
				</div>
			{:else}
				<!-- show the void card -->
				<div class="void">
					When the food is gone the birds return to the wood;<br />
					All that&rsquo;s left is emptiness and a great void.
				</div>
			{/if}
		</article>
	</div>
</Section>

<Section>
	<h2 class="text-xl font-heading-token font-bold mb-8 mt-4">Applications</h2>

	<div class="mb-12">
		{#if data.applications.length}
			<div class={`w-full ${data.applications.length > MAX_ROWS ? 'h-[calc(100vh-12rem)]' : ''}`}>
				<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
			</div>
		{:else}
			<p class="section-placeholder">{NONE_AT_THE_MOMENT}</p>
		{/if}
	</div>
</Section>

<Dialog title="Add a log entry" exitHelper bind:dialog={logCreateDialog}>
	<UserLogForm
		bind:dialog={logCreateDialog}
		data={data.userLogForm}
		action="../home?/createLog"
		userId={data.userId}
		students={[...owner.current_students]}
	/>
</Dialog>

<BinaryDialog
	bind:dialog={logDeleteDialog}
	title="Delete this log entry?"
	onYes={handleDeleteLog}
	dangerous
>
	<p class="text-surface-300 whitespace-nowrap overflow-hidden text-ellipsis">
		{activeLog?.text}
	</p>
</BinaryDialog>

<style lang="postcss">
	.panel {
		@apply gap-4;
	}

	.panel .void {
		@apply h-full;
		@apply flex justify-center items-center;
		@apply text-center font-heading-token text-surface-400;
	}

	.tab,
	.secondary-tab {
		@apply py-1;
		@apply text-surface-300;
		@apply border-b-2 border-transparent;
	}

	.tab.checked,
	.secondary-tab.checked {
		@apply font-bold;
		@apply border-primary-400;
		@apply text-surface-200;
	}
</style>
