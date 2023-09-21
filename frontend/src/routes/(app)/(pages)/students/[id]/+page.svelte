<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	import type { ContractListItem } from '$lib/types/contractTypes.js';
	import { deleteStudent } from '$lib/api.js';
	import { toast } from '$lib/utils/interactiveUtils.js';
	import { NONE_AT_THE_MOMENT, UNKNOWN_ERROR } from '$lib/constants/messages.js';

	import Section from '$lib/components/Section.svelte';

	import Paragraphs from '$lib/components/Paragraphs.svelte';
	import ContractCard from '$lib/components/ContractCard.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import BinaryDialog from '$lib/components/BinaryDialog.svelte';
	import StudentUpdateForm from '$lib/forms/StudentUpdateForm.svelte';
	import ContractServiceForm from '$lib/forms/ContractServiceForm.svelte';
	import ApplicationForm from '$lib/forms/ApplicationForm.svelte';
	import EnrollmentForm from '$lib/forms/EnrollmentForm.svelte';
	import ToeflScoreForm from '$lib/forms/ToeflScoreForm.svelte';
	import IeltsScoreForm from '$lib/forms/IeltsScoreForm.svelte';
	import DetScoreForm from '$lib/forms/DetScoreForm.svelte';
	import SatScoreForm from '$lib/forms/SatScoreForm.svelte';
	import ActScoreForm from '$lib/forms/ActScoreForm.svelte';
	import ApScoreForm from '$lib/forms/ApScoreForm.svelte';
	import GreScoreForm from '$lib/forms/GreScoreForm.svelte';
	import GmatScoreForm from '$lib/forms/GmatScoreForm.svelte';

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

	import {
		byEndDateStartDateDesc,
		byStatusThenTargetYearDesc,
		byTargetYearDesc
	} from '$lib/utils/sortUtils.js';
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
	import LsatScoreForm from '$lib/forms/LsatScoreForm.svelte';
	import IbGradeForm from '$lib/forms/IbGradeForm.svelte';
	import AlevelGradeForm from '$lib/forms/AlevelGradeForm.svelte';
	import { RECOGNIZED_TESTS } from '$lib/constants/recognizedTests.js';
	import OptionList from '$lib/components/OptionList.svelte';

	import EnrollmentCard from '$lib/components/EnrollmentCard.svelte';

	import ToeflScoreCard from '$lib/components/ToeflScoreCard.svelte';
	import IeltsScoreCard from '$lib/components/IeltsScoreCard.svelte';
	import DetScoreCard from '$lib/components/DetScoreCard.svelte';
	import SatScoreCard from '$lib/components/SatScoreCard.svelte';
	import ActScoreCard from '$lib/components/ActScoreCard.svelte';
	import GreScoreCard from '$lib/components/GreScoreCard.svelte';
	import GmatScoreCard from '$lib/components/GmatScoreCard.svelte';
	import LsatScoreCard from '$lib/components/LsatScoreCard.svelte';
	import ApScoresCard from '$lib/components/ApScoresCard.svelte';
	import IbGradesCard from '$lib/components/IbGradesCard.svelte';
	import AlevelGradesCard from '$lib/components/AlevelGradesCard.svelte';

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
	let testScoreCreateDialog: HTMLDialogElement;

	// Control which score creation form to display
	let testScoreType = '';

	$: hasTestScores =
		!!data.toeflScores.length ||
		!!data.ieltsScores.length ||
		!!data.detScores.length ||
		!!data.satScores.length ||
		!!data.actScores.length ||
		!!data.apScores.length ||
		!!data.ibFinalGrades.length ||
		!!data.ibPredictedGrades.length ||
		!!data.alevelFinalGrades.length ||
		!!data.alevelPredictedGrades.length ||
		!!data.greScores.length ||
		!!data.gmatScores.length ||
		!!data.lsatScores.length;

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

	<div class="grid grid-cols-3 gap-12 h-full max-h-[960px]">
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
						<Paragraphs paragraphs={student.comments} />
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

			<div class="flex-grow flex items-start">
				<button class="btn cf-btn cf-secondary" on:click={() => contractCreateDialog.showModal()}
					>Add a contract</button
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
	{/if}

	<div class="mt-6">
		{#if userIsOwner}
			<button class="btn cf-btn cf-secondary" on:click={() => applicationCreateDialog.showModal()}
				>Add an application</button
			>
		{:else if !data.applications.length}
			<p class="section-placeholder">{NONE_AT_THE_MOMENT}</p>
		{/if}
	</div>
</Section>

<Section lighter long>
	<div class="grid grid-cols-3 gap-12 items-start">
		<article class="panel transparent fit-height gap-6">
			<h2 class="text-xl font-heading-token font-bold">School Attendance</h2>

			{#if data.enrollments.length}
				<div class="flex flex-col gap-6">
					{#each data.enrollments.sort(byEndDateStartDateDesc) as enrollment}
						<div class="panel fit-height enrollment-card">
							<EnrollmentCard {enrollment} />
						</div>
					{/each}
				</div>
			{/if}

			<div>
				{#if userIsOwner}
					<button
						class="btn cf-btn cf-secondary"
						on:click={() => enrollmentCreateDialog.showModal()}>Add a record</button
					>
				{:else if !data.enrollments.length}
					<p class="section-placeholder">{NONE_AT_THE_MOMENT}</p>
				{/if}
			</div>
		</article>

		<article class="col-span-2 panel transparent fit-height gap-6">
			<h2 class="text-xl font-heading-token font-bold">Test Scores</h2>

			{#if hasTestScores}
				<div class="grid grid-cols-3 gap-6">
					<!-- Order by level (graduate first) and specificity (more specialized test first) -->
					{#each data.lsatScores as lsatScore}
						<LsatScoreCard data={lsatScore} />
					{/each}
					{#each data.gmatScores as gmatScore}
						<GmatScoreCard data={gmatScore} />
					{/each}
					{#each data.greScores as greScore}
						<GreScoreCard data={greScore} />
					{/each}

					{#each data.satScores as satScore}
						<SatScoreCard data={satScore} />
					{/each}
					{#each data.actScores as actScore}
						<ActScoreCard data={actScore} />
					{/each}

					{#each data.toeflScores as toeflScore}
						<ToeflScoreCard data={toeflScore} />
					{/each}
					{#each data.ieltsScores as ieltsScore}
						<IeltsScoreCard data={ieltsScore} />
					{/each}
					{#each data.detScores as detScore}
						<DetScoreCard data={detScore} />
					{/each}

					{#if data.apScores.length}
						<ApScoresCard data={data.apScores} />
					{/if}

					{#if data.ibPredictedGrades.length}
						<IbGradesCard data={data.ibPredictedGrades} gradesType="predicted" />
					{/if}
					{#if data.ibFinalGrades.length}
						<IbGradesCard data={data.ibFinalGrades} gradesType="final" />
					{/if}

					{#if data.alevelPredictedGrades.length}
						<AlevelGradesCard data={data.alevelPredictedGrades} gradesType="predicted" />
					{/if}
					{#if data.alevelFinalGrades.length}
						<AlevelGradesCard data={data.alevelFinalGrades} gradesType="final" />
					{/if}
				</div>
			{/if}

			<div>
				{#if userIsOwner}
					<button class="btn cf-btn cf-secondary" on:click={() => testScoreCreateDialog.showModal()}
						>Add a test score</button
					>
				{:else if !hasTestScores}
					<p class="section-placeholder">{NONE_AT_THE_MOMENT}</p>
				{/if}
			</div>
		</article>
	</div>
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

<Dialog title="Add a test score" exitHelper fullHeight bind:dialog={testScoreCreateDialog}>
	<div class="flex flex-col mb-8">
		<label for="test-select" class="label">Select a test</label>
		<select id="test-select" class="select" bind:value={testScoreType}>
			<OptionList options={Array.from(RECOGNIZED_TESTS)} />
		</select>
	</div>

	{#if testScoreType === 'TOEFL'}
		<ToeflScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createToeflScore"
			studentId={student.id}
			data={data.toeflScoreForm}
		/>
	{:else if testScoreType === 'IELTS'}
		<IeltsScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createIeltsScore"
			studentId={student.id}
			data={data.ieltsScoreForm}
		/>
	{:else if testScoreType === 'DET'}
		<DetScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createDetScore"
			studentId={student.id}
			data={data.detScoreForm}
		/>
	{:else if testScoreType === 'SAT'}
		<SatScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createSatScore"
			studentId={student.id}
			data={data.satScoreForm}
		/>
	{:else if testScoreType === 'ACT'}
		<ActScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createActScore"
			studentId={student.id}
			data={data.actScoreForm}
		/>
	{:else if testScoreType === 'AP'}
		<ApScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createApScore"
			studentId={student.id}
			data={data.apScoreForm}
		/>
	{:else if testScoreType === 'IB (predicted)'}
		<IbGradeForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createIbPredictedGrade"
			studentId={student.id}
			data={data.ibGradeForm}
		/>
	{:else if testScoreType === 'IB (final)'}
		<IbGradeForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createIbFinalGrade"
			studentId={student.id}
			data={data.ibGradeForm}
		/>
	{:else if testScoreType === 'A-Level (predicted)'}
		<AlevelGradeForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createAlevelPredictedGrade"
			studentId={student.id}
			data={data.alevelGradeForm}
		/>
	{:else if testScoreType === 'A-Level (final)'}
		<AlevelGradeForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createAlevelFinalGrade"
			studentId={student.id}
			data={data.alevelGradeForm}
		/>
	{:else if testScoreType === 'GRE'}
		<GreScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createGreScore"
			studentId={student.id}
			data={data.greScoreForm}
		/>
	{:else if testScoreType === 'GMAT'}
		<GmatScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createGmatScore"
			studentId={student.id}
			data={data.gmatScoreForm}
		/>
	{:else if testScoreType === 'LSAT'}
		<LsatScoreForm
			bind:dialog={testScoreCreateDialog}
			action="/scores?/createLsatScore"
			studentId={student.id}
			data={data.lsatScoreForm}
		/>
	{:else}
		<div />
	{/if}
</Dialog>

<style lang="postcss">
	.cf-entry-label {
		@apply mb-1;
	}

	.panel.contract-card {
		@apply h-fit min-h-fit;
		@apply rounded-l-none border-l-transparent;
	}
	.panel.enrollment-card {
		@apply h-fit min-h-fit;
		@apply rounded-t-none border-t-transparent;
	}
</style>
