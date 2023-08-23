<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import StudentLegalNameForm from '$lib/forms/StudentLegalNameForm.svelte';
	import StudentRomanizedNameForm from '$lib/forms/StudentRomanizedNameForm.svelte';
	import StudentGenderForm from '$lib/forms/StudentGenderForm.svelte';
	import StudentCitizenshipForm from '$lib/forms/StudentCitizenshipForm.svelte';
	import StudentDateOfBirthForm from '$lib/forms/StudentDateOfBirthForm.svelte';
	import StudentResidenceForm from '$lib/forms/StudentResidenceForm.svelte';
	import StudentCommentsForm from '$lib/forms/StudentCommentsForm.svelte';
	import ContractForm from '$lib/forms/ContractForm.svelte';
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
	import ContractCard from '$lib/components/ContractCard.svelte';
	import { byStatusThenTargetYearDesc } from '$lib/utils/sortUtils.js';

	export let data;

	$: student = data.student;

	const planners = sortByUsername(filterForPlanners(data.cfPeople));
	const essayAdvisors = sortByUsername(filterForEssayAdvisors(data.cfPeople));
	const specialPeople = sortByUsername(filterForSpecial(data.cfPeople));

	const userCanEdit = true;

	// Modals

	let legalNameDialog: HTMLDialogElement;
	let romanizedNameDialog: HTMLDialogElement;
	let genderDialog: HTMLDialogElement;
	let citizenshipDialog: HTMLDialogElement;
	let dateOfBirthDialog: HTMLDialogElement;
	let residenceDialog: HTMLDialogElement;
	let commentsDialog: HTMLDialogElement;
	let contractCreateDialog: HTMLDialogElement;
	let applicationCreateDialog: HTMLDialogElement;
</script>

<h1>{formatStudentName(student)}</h1>

<PageSection>
	<div class="profile-grid">
		<div class="cf-key row-span-2">Name</div>
		<div class="cf-value">
			{formatStudentName(student)}
			{#if userCanEdit}
				<button on:click={() => legalNameDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="cf-value">
			{formatStudentRomanizedName(student)}
			{#if userCanEdit}
				<button on:click={() => romanizedNameDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Gender</div>
		<div class="cf-value">
			{student.gender}
			{#if userCanEdit}
				<button on:click={() => genderDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Citizen of</div>
		<div class="cf-value">
			{student.citizenship}
			{#if userCanEdit}
				<button on:click={() => citizenshipDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Born</div>
		<div class="cf-value">
			{student.date_of_birth ?? ''}
			{#if userCanEdit}
				<button on:click={() => dateOfBirthDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Based in</div>
		<div class="cf-value">
			{formatResidence(student)}
			{#if userCanEdit}
				<button on:click={() => residenceDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="cf-key">Comments</div>
		<div class="cf-value">
			{student.comments}
			{#if userCanEdit}
				<button on:click={() => commentsDialog.showModal()}>Edit</button>
			{/if}
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Contracts</svelte:fragment>

	<div class="flex flex-wrap gap-4">
		{#each data.contracts.sort(byStatusThenTargetYearDesc) as contract}
			<ContractCard {contract}>
				{#if userCanEdit}
					<!-- TODO turn the edit button into a link? -->
					<button class="text-primary-600 hover:text-primary-500" disabled>Edit</button>
					<button class="text-error-600 hover:text-error-500" disabled>Delete</button>
				{/if}
			</ContractCard>
		{/each}
	</div>

	<button class="section-cta" on:click={() => contractCreateDialog.showModal()}
		>Add a contract</button
	>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	{#if data.applications.length}
		<pre
			class="text-surface-400 overflow-auto h-[50vh] min-h-[10rem] bg-surface-700">{JSON.stringify(
				data.applications,
				null,
				2
			)}</pre>
	{/if}

	<button class="section-cta" on:click={() => applicationCreateDialog.showModal()}
		>Add an application</button
	>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Updates</svelte:fragment>
	{#if data.logs.length}
		<pre class="text-surface-400">{JSON.stringify(data.logs, null, 2)}</pre>
	{/if}

	<button class="section-cta">Add an update</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">School performance</svelte:fragment>
	{#if data.enrollments.length}
		<pre class="text-surface-400">{JSON.stringify(data.enrollments, null, 2)}</pre>
	{/if}

	<button class="section-cta">Add a school</button>
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

	<button class="section-cta">Add a test score</button>
</PageSection>

<!-- Dialogs -->

<Dialog exitHelper bind:dialog={legalNameDialog}>
	<StudentLegalNameForm
		bind:dialog={legalNameDialog}
		action="?/updateLegalName"
		studentId={student.id}
		data={data.legalNameForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={romanizedNameDialog}>
	<StudentRomanizedNameForm
		bind:dialog={romanizedNameDialog}
		action="?/updateRomanizedName"
		studentId={student.id}
		data={data.romanizedNameForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={genderDialog}>
	<StudentGenderForm
		bind:dialog={genderDialog}
		action="?/updateGender"
		studentId={student.id}
		data={data.genderForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={citizenshipDialog}>
	<StudentCitizenshipForm
		bind:dialog={citizenshipDialog}
		action="?/updateCitizenship"
		studentId={student.id}
		data={data.citizenshipForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={dateOfBirthDialog}>
	<StudentDateOfBirthForm
		bind:dialog={dateOfBirthDialog}
		action="?/updateDateOfBirth"
		studentId={student.id}
		data={data.dateOfBirthForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={residenceDialog}>
	<StudentResidenceForm
		bind:dialog={residenceDialog}
		action="?/updateResidence"
		studentId={student.id}
		data={data.residenceForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={commentsDialog}>
	<StudentCommentsForm
		bind:dialog={commentsDialog}
		action="?/updateComments"
		studentId={student.id}
		data={data.commentsForm}
	/>
</Dialog>

<Dialog title="Add a contract" exitHelper bind:dialog={contractCreateDialog}>
	<ContractForm
		bind:dialog={contractCreateDialog}
		action="?/createContract"
		studentId={student.id}
		data={data.contractCreateForm}
		{planners}
		{essayAdvisors}
		{specialPeople}
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
