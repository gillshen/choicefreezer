<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import type { ContractListItem } from '$lib/types/contractTypes.js';
	import { deleteStudent } from '$lib/api.js';
	import { toast } from '$lib/utils/interactiveUtils.js';
	import { NO_ROWS_TO_SHOW, UNKNOWN_ERROR } from '$lib/constants/messages.js';

	import Section from '$lib/components/Section.svelte';

	import ContractCard from '$lib/components/ContractCard.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import BinaryDialog from '$lib/components/BinaryDialog.svelte';
	import StudentUpdateForm from '$lib/forms/StudentUpdateForm.svelte';
	import ContractServiceForm from '$lib/forms/ContractServiceForm.svelte';
	import ApplicationForm from '$lib/forms/ApplicationForm.svelte';
	import EnrollmentForm from '$lib/forms/EnrollmentForm.svelte';

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

	import { byStatusThenTargetYearDesc, byTargetYearDesc } from '$lib/utils/sortUtils.js';
	import { toLongDate } from '$lib/utils/dateUtils';

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

	export let data;

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

	$: gridOptions = {
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
	let enrollmentCreateDialog: HTMLDialogElement;

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

	function isUserOwner(username: string) {
		// When there is no contract associated with the student, anyone is an owner
		if (!data.contracts.length) {
			return true;
		}
		// Else all the parties to the latest contract (and only these users) are
		const latestContract: ContractListItem = data.contracts.sort(byTargetYearDesc)[0];
		return latestContract.services.map((s) => s.cf_username).includes(username);
	}

	$: userIsOwner = isUserOwner(data.username);

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<Section hero>
	<h1 class="cf-h1">
		{formattedName}{#if formattedName !== formattedRomanizedName}
			&nbsp;/ {formattedRomanizedName}
		{/if}
	</h1>

	<div class="grid grid-cols-3 gap-16 h-full max-h-[960px]">
		<!-- personal info -->
		<article class="panel">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="cf-entry">{student.gender}</div>

				<div class="cf-entry">Citizen of {student.citizenship}</div>

				{#if student.city || student.state}
					<div class="cf-entry">
						<div class="cf-entry-label">Residence</div>
						{formatResidence(student)}
					</div>
				{/if}

				{#if student.date_of_birth}
					<div class="cf-entry">
						<div class="cf-entry-label">Date of birth</div>
						{toLongDate(student.date_of_birth)}
					</div>
				{/if}

				<div class={`cf-entry flex flex-col overflow-hidden`}>
					<div class="cf-entry-label">Comments</div>
					<div class="flex-grow min-h-[8rem] overflow-auto pr-2 text-surface-200">
						{student.comments}
					</div>
				</div>

				{#if userIsOwner}
					<footer class="flex gap-6 mt-auto pt-4">
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-primary-400 hover:text-primary-500"
							on:click={() => studentUpdateDialog.showModal()}>Edit</button
						>
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-error-400 hover:text-error-500"
							on:click={() => studentDeleteDialog.showModal()}>Delete</button
						>
					</footer>
				{/if}
			</div>
		</article>

		<article class="panel">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="cf-entry">
					<div class="cf-entry-label">Current school</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">GPA</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Class rank</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">SAT / ACT / GRE 1</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">SAT / ACT / GRE 2</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">TOEFL / IELTS / DET</div>
				</div>
			</div>
		</article>

		<div class="panel transparent gap-6 overflow-auto">
			<div class="flex flex-col gap-6 overflow-auto">
				{#each data.contracts.sort(byStatusThenTargetYearDesc) as contract}
					<article class="panel fit-height contract-card">
						<ContractCard {contract} />
					</article>
				{/each}
			</div>

			<div class="flex-grow flex justify-center items-start">
				<button
					class="btn cf-btn w-full cf-secondary"
					on:click={() => contractCreateDialog.showModal()}>Add a contract</button
				>
			</div>
		</div>
	</div>
</Section>

<Section>
	<h2 class="text-xl font-heading-token font-bold mb-8">Applications</h2>

	{#if data.applications.length}
		<div class="w-full">
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p class="section-placeholder">{NO_ROWS_TO_SHOW}</p>
	{/if}

	{#if userIsOwner}
		<div class="mt-4">
			<button class="btn cf-btn cf-secondary" on:click={() => applicationCreateDialog.showModal()}
				>Add an application</button
			>
		</div>
	{/if}
</Section>

<Section>
	<h2 class="text-xl font-heading-token font-bold mb-8">Educational History</h2>

	{#if data.enrollments.length}
		<pre class="text-surface-400">{JSON.stringify(data.enrollments, null, 2)}</pre>
	{:else}
		<p class="section-placeholder">{NO_ROWS_TO_SHOW}</p>
	{/if}

	{#if userIsOwner}
		<div class="mt-4">
			<button class="btn cf-btn cf-secondary" on:click={() => enrollmentCreateDialog.showModal()}
				>Add a stint</button
			>
		</div>
	{/if}
</Section>

<Section>
	<h2 class="text-xl font-heading-token font-bold mb-8">Test Scores</h2>

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

	{#if userIsOwner}
		<div class="mt-4">
			<button class="btn cf-btn cf-secondary">Add a test score</button>
		</div>
	{/if}
</Section>

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
	<p class="text-surface-200">
		You are about to delete all the data pertaining to this student, including personal profile,
		contracts, educational histories, test scores, and applications. Are you sure you want to
		proceed?
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

<Dialog title="Add an enrollment record" exitHelper bind:dialog={enrollmentCreateDialog}>
	<EnrollmentForm
		bind:dialog={enrollmentCreateDialog}
		action="?/createEnrollment"
		studentId={student.id}
		data={data.enrollmentCreateForm}
		schools={data.schools}
	/>
</Dialog>

<style lang="postcss">
	.cf-entry-label {
		@apply mb-1;
	}

	.panel.contract-card {
		@apply h-fit min-h-[140px];
		@apply rounded-l-none border-l-transparent;
	}
</style>
