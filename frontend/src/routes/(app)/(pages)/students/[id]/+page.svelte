<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import { deleteStudent } from '$lib/api.js';
	import { toast } from '$lib/utils/interactiveUtils.js';
	import { NO_ROWS_TO_SHOW, UNKNOWN_ERROR } from '$lib/constants/messages.js';

	import PageSection from '$lib/components/PageSection.svelte';
	import ContractCard from '$lib/components/ContractCard.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import StudentUpdateForm from '$lib/forms/StudentUpdateForm.svelte';
	import ContractServiceForm from '$lib/forms/ContractServiceForm.svelte';
	import ApplicationForm from '$lib/forms/ApplicationForm.svelte';

	import {
		formatStudentName,
		formatStudentRomanizedName,
		formatResidence
	} from '$lib/utils/studentUtils.js';

	import {
		filterForEssayAdvisors,
		filterForPlanners,
		filterForSpecial,
		sortByUsername
	} from '$lib/utils/userUtils.js';

	import { byStatusThenTargetYearDesc } from '$lib/utils/sortUtils.js';

	import type { DomLayoutType } from 'ag-grid-community';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';
	import {
		ApplicationIdRenderer,
		TargetRenderer,
		ProgramRenderer,
		StatusRenderer,
		targetValueGetter,
		schoolAbbreviationsValueGetter,
		deadlineValueGetter,
		deadlineValueFormatter
	} from '$lib/utils/applicationGridUtils.js';
	import BinaryDialog from '$lib/components/BinaryDialog.svelte';
	import { toLongDate } from '$lib/utils/dateUtils';

	export let data;

	const userCanEdit = true;

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

	const gridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs: applicationColumnDefs,
		rowData: data.applications,
		suppressDragLeaveHidesColumns: true,
		domLayout: 'autoHeight' as DomLayoutType
	};

	// Modals
	let studentUpdateDialog: HTMLDialogElement;
	let studentDeleteDialog: HTMLDialogElement;
	let contractCreateDialog: HTMLDialogElement;
	let applicationCreateDialog: HTMLDialogElement;

	// TODO move to server side?
	async function handleDeleteStudent() {
		const response = await deleteStudent(student.id);
		if (response.ok) {
			studentDeleteDialog.close();
			toast('Student deleted. Redirecting...', 'success');
			setTimeout(() => goto('../home/'), 2000);
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	$: student = data.student;

	$: formattedName = formatStudentName(student);
	$: formattedRomanizedName = formatStudentRomanizedName(student);

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<h1>{formattedName}</h1>

<PageSection>
	<div class="grid grid-cols-2 gap-x-12 gap-y-8 auto-rows-min items-start">
		<div class="px-0 py-6 auto-rows-min rounded-xl flex flex-col">
			<div class="profile-grid flex-grow pb-6">
				<div class="cf-key">Name</div>
				<div class="cf-value">
					{formattedName}{#if !(formattedName === formattedRomanizedName)}
						&nbsp;/ {formattedRomanizedName}
					{/if}
				</div>

				<div class="cf-key">Gender</div>
				<div class="cf-value">{student.gender}</div>

				<div class="cf-key">Citizen of</div>
				<div class="cf-value">{student.citizenship}</div>

				<div class="cf-key">Born</div>
				<div class="cf-value">
					{student.date_of_birth ? toLongDate(student.date_of_birth) : 'n/a'}
				</div>

				<div class="cf-key">Based in</div>
				<div class="cf-value">{formatResidence(student) || 'n/a'}</div>

				{#if student.comments}
					<div class="cf-key">Comments</div>
					<div class="cf-value">{student.comments}</div>
				{/if}
			</div>

			{#if userCanEdit}
				<div class="flex gap-4">
					<button class="section-cta" on:click={() => studentUpdateDialog.showModal()}>Edit</button>
					<button class="section-cta delete" on:click={() => studentDeleteDialog.showModal()}
						>Delete</button
					>
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-8">
			<div class="cf-card-shadow-concave p-4 rounded-xl">
				<div class="inner-card">GPA</div>
			</div>

			<div class="cf-card-shadow-concave p-4 rounded-xl">
				<div class="inner-card">Class rank</div>
			</div>

			<div class="cf-card-shadow-concave p-4 rounded-xl">
				<div class="inner-card">SAT / ACT / GRE 1</div>
			</div>
			<div class="cf-card-shadow-concave p-4 rounded-xl">
				<div class="inner-card">SAT / ACT / GRE 2</div>
			</div>

			<div class="cf-card-shadow-concave p-4 rounded-xl">
				<div class="inner-card">TOEFL / IELTS</div>
			</div>
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Contracts</svelte:fragment>

	<div class="grid grid-cols-3 gap-x-8 gap-y-8">
		{#each data.contracts.sort(byStatusThenTargetYearDesc) as contract}
			<ContractCard {contract} />
		{/each}
	</div>

	{#if userCanEdit}
		<button class="section-cta" on:click={() => contractCreateDialog.showModal()}
			>Add a contract</button
		>
	{/if}
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>

	{#if data.applications.length}
		<div class="w-full">
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p class="section-placeholder">{NO_ROWS_TO_SHOW}</p>
	{/if}

	{#if userCanEdit}
		<button class="section-cta" on:click={() => applicationCreateDialog.showModal()}
			>Add an application</button
		>
	{/if}
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Logs</svelte:fragment>
	{#if data.logs.length}
		<pre class="text-surface-400">{JSON.stringify(data.logs, null, 2)}</pre>
	{/if}

	{#if userCanEdit}
		<button class="section-cta">Add an entry</button>
	{/if}
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">School performance</svelte:fragment>
	{#if data.enrollments.length}
		<pre class="text-surface-400">{JSON.stringify(data.enrollments, null, 2)}</pre>
	{/if}

	{#if userCanEdit}
		<button class="section-cta">Add a school</button>
	{/if}
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Test Scores</svelte:fragment>

	{#if data.toeflScores.length}
		<h3>TOEFL</h3>
		<pre class="text-surface-400">{JSON.stringify(data.toeflScores, null, 2)}</pre>
	{/if}

	{#if data.ieltslScores.length}
		<h3>IELTS</h3>
		<pre class="text-surface-400">{JSON.stringify(data.ieltslScores, null, 2)}</pre>
	{/if}

	{#if data.detScores.length}
		<h3>DET</h3>
		<pre class="text-surface-400">{JSON.stringify(data.detScores, null, 2)}</pre>
	{/if}

	{#if data.satScores.length}
		<h3>SAT</h3>
		<pre class="text-surface-400">{JSON.stringify(data.satScores, null, 2)}</pre>
	{/if}

	{#if data.actScores.length}
		<h3>ACT</h3>
		<pre class="text-surface-400">{JSON.stringify(data.actScores, null, 2)}</pre>
	{/if}

	{#if data.apScores.length}
		<h3>AP</h3>
		<pre class="text-surface-400">{JSON.stringify(data.apScores, null, 2)}</pre>
	{/if}

	{#if data.greScores.length}
		<h3>GRE</h3>
		<pre class="text-surface-400">{JSON.stringify(data.greScores, null, 2)}</pre>
	{/if}

	{#if userCanEdit}
		<button class="section-cta">Add a test score</button>
	{/if}
</PageSection>

<!-- Dialogs -->

<Dialog exitHelper bind:dialog={studentUpdateDialog}>
	<StudentUpdateForm
		bind:dialog={studentUpdateDialog}
		action="?/updateStudent"
		data={data.studentUpdateForm}
	/>
</Dialog>

<BinaryDialog
	title="Proceed with caution"
	bind:dialog={studentDeleteDialog}
	onYes={handleDeleteStudent}
	dangerous
>
	<p>
		You are about to delete all data pertaining to this student, including contracts, educational
		histories, test scores, and applications. Are you sure you want to proceed?
	</p>
</BinaryDialog>

<Dialog title="Add a contract" exitHelper bind:dialog={contractCreateDialog}>
	<ContractServiceForm
		bind:dialog={contractCreateDialog}
		action="?/createContract"
		studentId={student.id}
		data={data.contractCreateForm}
		planners={sortByUsername(filterForPlanners(data.cfPeople))}
		essayAdvisors={sortByUsername(filterForEssayAdvisors(data.cfPeople))}
		specialPeople={sortByUsername(filterForSpecial(data.cfPeople))}
	/>
</Dialog>

<Dialog title="Add an application" exitHelper bind:dialog={applicationCreateDialog}>
	<ApplicationForm
		bind:dialog={applicationCreateDialog}
		action="?/createApplication"
		studentId={student.id}
		data={data.applicationCreateForm}
		schools={data.schools}
		programs={data.programs}
	/>
</Dialog>

<style lang="postcss">
	.inner-card {
		@apply w-full min-h-[5rem] rounded-md flex items-center justify-center;
	}
</style>
