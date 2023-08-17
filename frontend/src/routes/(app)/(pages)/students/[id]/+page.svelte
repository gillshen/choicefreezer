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

	export let data;
	const {
		cfPeople,
		student,
		contracts,
		logs,
		enrollments,
		toeflScores,
		ieltslScores,
		detScores,
		satScores,
		actScores,
		apScores,
		greScores,
		applications
	} = data;

	const planners = sortByUsername(filterForPlanners(cfPeople));
	const essayAdvisors = sortByUsername(filterForEssayAdvisors(cfPeople));
	const specialPeople = sortByUsername(filterForSpecial(cfPeople));

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
</script>

<h1>{formatStudentName(student)}</h1>

<PageSection>
	<div class="student-profile-grid">
		<div class="key row-span-2">Name</div>
		<div class="value">
			{formatStudentName(student)}
			{#if userCanEdit}
				<button on:click={() => legalNameDialog.showModal()}>Update</button>
			{/if}
		</div>

		<div class="value">
			{formatStudentRomanizedName(student)}
			{#if userCanEdit}
				<button on:click={() => romanizedNameDialog.showModal()}>Update</button>
			{/if}
		</div>

		<div class="key">Gender</div>
		<div class="value">
			{student.gender}
			{#if userCanEdit}
				<button on:click={() => genderDialog.showModal()}>Update</button>
			{/if}
		</div>

		<div class="key">Citizen of</div>
		<div class="value">
			{student.citizenship}
			{#if userCanEdit}
				<button on:click={() => citizenshipDialog.showModal()}>Update</button>
			{/if}
		</div>

		<div class="key">Born</div>
		<div class="value">
			{student.date_of_birth ?? ''}
			{#if userCanEdit}
				<button on:click={() => dateOfBirthDialog.showModal()}>Update</button>
			{/if}
		</div>

		<div class="key">Based in</div>
		<div class="value">
			{formatResidence(student)}
			{#if userCanEdit}
				<button on:click={() => residenceDialog.showModal()}>Update</button>
			{/if}
		</div>

		<div class="key">Comments</div>
		<div class="value">
			{student.comments}
			{#if userCanEdit}
				<button on:click={() => commentsDialog.showModal()}>Update</button>
			{/if}
		</div>
	</div>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Contracts</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(contracts, null, 2)}</pre>

	<button class="cf-secondary" on:click={() => contractCreateDialog.showModal()}
		>Create a contract</button
	>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Logs</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(logs, null, 2)}</pre>

	<button class="cf-secondary">Add an update</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Enrollments</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(enrollments, null, 2)}</pre>

	<button class="cf-secondary">Add an enrollment</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Test Scores</svelte:fragment>

	{#if toeflScores.length}
		<h3>TOEFL</h3>
		<pre class="text-surface-400">{JSON.stringify(toeflScores, null, 2)}</pre>
	{/if}

	{#if ieltslScores.length}
		<h3>IELTS</h3>
		<pre class="text-surface-400">{JSON.stringify(ieltslScores, null, 2)}</pre>
	{/if}

	{#if detScores.length}
		<h3>DET</h3>
		<pre class="text-surface-400">{JSON.stringify(detScores, null, 2)}</pre>
	{/if}

	{#if satScores.length}
		<h3>SAT</h3>
		<pre class="text-surface-400">{JSON.stringify(satScores, null, 2)}</pre>
	{/if}

	{#if actScores.length}
		<h3>ACT</h3>
		<pre class="text-surface-400">{JSON.stringify(actScores, null, 2)}</pre>
	{/if}

	{#if apScores.length}
		<h3>AP</h3>
		<pre class="text-surface-400">{JSON.stringify(apScores, null, 2)}</pre>
	{/if}

	{#if greScores.length}
		<h3>GRE</h3>
		<pre class="text-surface-400">{JSON.stringify(greScores, null, 2)}</pre>
	{/if}

	<button class="cf-secondary">Add a test</button>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Applications</svelte:fragment>
	<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>

	<button class="cf-primary">Add an application</button>
</PageSection>

<!-- Dialogs -->

<Dialog exitHelper bind:dialog={legalNameDialog}>
	<StudentLegalNameForm
		dialog={legalNameDialog}
		action="?/updateLegalName"
		studentId={student.id}
		data={data.legalNameForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={romanizedNameDialog}>
	<StudentRomanizedNameForm
		dialog={romanizedNameDialog}
		action="?/updateRomanizedName"
		studentId={student.id}
		data={data.romanizedNameForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={genderDialog}>
	<StudentGenderForm
		dialog={genderDialog}
		action="?/updateGender"
		studentId={student.id}
		data={data.genderForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={citizenshipDialog}>
	<StudentCitizenshipForm
		dialog={citizenshipDialog}
		action="?/updateCitizenship"
		studentId={student.id}
		data={data.citizenshipForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={dateOfBirthDialog}>
	<StudentDateOfBirthForm
		dialog={dateOfBirthDialog}
		action="?/updateDateOfBirth"
		studentId={student.id}
		data={data.dateOfBirthForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={residenceDialog}>
	<StudentResidenceForm
		dialog={residenceDialog}
		action="?/updateResidence"
		studentId={student.id}
		data={data.residenceForm}
	/>
</Dialog>

<Dialog exitHelper bind:dialog={commentsDialog}>
	<StudentCommentsForm
		dialog={commentsDialog}
		action="?/updateComments"
		studentId={student.id}
		data={data.commentsForm}
	/>
</Dialog>

<Dialog title="Create a contract" exitHelper bind:dialog={contractCreateDialog}>
	<ContractForm
		dialog={contractCreateDialog}
		action="?/createContract"
		studentId={student.id}
		data={data.contractCreateForm}
		{planners}
		{essayAdvisors}
		{specialPeople}
	/>
</Dialog>

<style lang="postcss">
	.student-profile-grid {
		display: grid;
		grid-template-columns: max-content 20rem;
		row-gap: 1rem;
		column-gap: 2rem;
	}
	.student-profile-grid .key {
		@apply text-surface-400;
	}
	.student-profile-grid .value {
		@apply flex flex-wrap gap-4 w-full;
	}
	.student-profile-grid .value button {
		@apply text-primary-500;
		opacity: 0;
		transition: opacity 0.5s;
	}
	.student-profile-grid .value:hover button {
		opacity: 1;
	}
</style>
