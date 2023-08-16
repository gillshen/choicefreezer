<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import PageSection from '$lib/components/PageSection.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import StudentLegalNameFields from '$lib/components/StudentLegalNameFields.svelte';
	import StudentRomanizedNameFields from '$lib/components/StudentRomanizedNameFields.svelte';
	import StudentGenderField from '$lib/components/StudentGenderField.svelte';
	import StudentCitizenshipField from '$lib/components/StudentCitizenshipField.svelte';
	import StudentDobField from '$lib/components/StudentDobField.svelte';
	import StudentResidenceFields from '$lib/components/StudentResidenceFields.svelte';
	import StudentCommentsField from '$lib/components/StudentCommentsField.svelte';
	import ContractFormFields from '$lib/components/ContractFormFields.svelte';
	import ServiceFormFields from '$lib/components/ServiceFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

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

	function closeAndReloadOnSuccess(dialog: HTMLDialogElement | undefined) {
		return ({ result }: any) => {
			if (result.type === 'success') {
				dialog?.close();
				/*
				 * Calling location.reload() immediately will cause a blank page
				 * with "200" and "Internal error" to be shown briefly before the
				 * normal page loads -- possibly because the immediate reload
				 * breaks something superform is doing. So wait for half a second.
				 */
				setTimeout(() => location.reload(), 500);
			}
		};
	}

	// Forms

	const {
		form: legalNameForm,
		errors: legalNameErrors,
		message: legalNameMessage,
		enhance: legalNameEnhance
	} = superForm(data.legalNameForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(legalNameDialog!)
	});

	const {
		form: romanizedNameForm,
		errors: romanizedNameErrors,
		message: romanizedNameMessage,
		enhance: romanizedNameEnhance
	} = superForm(data.romanizedNameForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(romanizedNameDialog!)
	});

	const {
		form: genderForm,
		errors: genderErrors,
		message: genderMessage,
		enhance: genderEnhance
	} = superForm(data.genderForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(genderDialog!)
	});

	const {
		form: citizenshipForm,
		errors: citizenshipErrors,
		message: citizenshipMessage,
		enhance: citizenshipEnhance
	} = superForm(data.citizenshipForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(citizenshipDialog!)
	});

	const {
		form: dateOfBirthForm,
		errors: dateOfBirthErrors,
		message: dateOfBirthMessage,
		enhance: dateOfBirthEnhance
	} = superForm(data.dateOfBirthForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(dateOfBirthDialog!)
	});

	const {
		form: residenceForm,
		errors: residenceErrors,
		message: residenceMessage,
		enhance: residenceEnhance
	} = superForm(data.residenceForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(residenceDialog!)
	});

	const {
		form: commentsForm,
		errors: commentsErrors,
		message: commentsMessage,
		enhance: commentsEnhance
	} = superForm(data.commentsForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(commentsDialog!)
	});

	const {
		form: contractCreateForm,
		errors: contractCreateErrors,
		message: contractCreateMessae,
		enhance: contractCreateEnhance
	} = superForm(data.contractCreateForm, {
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(contractCreateDialog!)
	});
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
	<!-- <SuperDebug data={$legalNameForm} /> -->
	<form method="post" action="?/updateLegalName" novalidate use:legalNameEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField value={student.id} />
			<StudentLegalNameFields form={$legalNameForm} errors={$legalNameErrors} />
		</fieldset>
		<FormSubmit message={$legalNameMessage} />
	</form>
</Dialog>

<Dialog exitHelper bind:dialog={romanizedNameDialog}>
	<!-- <SuperDebug data={$romanizedNameForm} /> -->
	<form method="post" action="?/updateRomanizedName" novalidate use:romanizedNameEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField value={student.id} />
			<StudentRomanizedNameFields form={$romanizedNameForm} errors={$romanizedNameErrors} />
		</fieldset>
		<FormSubmit message={$romanizedNameMessage} />
	</form>
</Dialog>

<Dialog exitHelper bind:dialog={genderDialog}>
	<!-- <SuperDebug data={$genderForm} /> -->
	<form method="post" action="?/updateGender" novalidate use:genderEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField value={student.id} />
			<StudentGenderField form={$genderForm} errors={$genderErrors} />
		</fieldset>
		<FormSubmit message={$genderMessage} />
	</form>
</Dialog>

<Dialog exitHelper bind:dialog={citizenshipDialog}>
	<!-- <SuperDebug data={$citizenshipForm} /> -->
	<form method="post" action="?/updateCitizenship" novalidate use:citizenshipEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField value={student.id} />
			<StudentCitizenshipField form={$citizenshipForm} errors={$citizenshipErrors} />
		</fieldset>
		<FormSubmit message={$citizenshipMessage} />
	</form>
</Dialog>

<Dialog exitHelper bind:dialog={dateOfBirthDialog}>
	<!-- <SuperDebug data={$dateOfBirthForm} /> -->
	<form method="post" action="?/updateDateOfBirth" novalidate use:dateOfBirthEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField value={student.id} />
			<StudentDobField form={$dateOfBirthForm} errors={$dateOfBirthErrors} />
		</fieldset>
		<FormSubmit message={$dateOfBirthMessage} />
	</form>
</Dialog>

<Dialog exitHelper bind:dialog={residenceDialog}>
	<!-- <SuperDebug data={$residenceForm} /> -->
	<form method="post" action="?/updateResidence" novalidate use:residenceEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField value={student.id} />
			<StudentResidenceFields form={$residenceForm} errors={$residenceErrors} />
		</fieldset>
		<FormSubmit message={$residenceMessage} />
	</form>
</Dialog>

<Dialog exitHelper bind:dialog={commentsDialog}>
	<!-- <SuperDebug data={$commentsForm} /> -->
	<form method="post" action="?/updateComments" novalidate use:commentsEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField value={student.id} />
			<StudentCommentsField form={$commentsForm} errors={$commentsErrors} />
		</fieldset>
		<FormSubmit message={$commentsMessage} />
	</form>
</Dialog>

<Dialog title="Create a contract" exitHelper bind:dialog={contractCreateDialog}>
	<!-- <SuperDebug data={$contractCreateForm} /> -->
	<form method="post" action="?/createContract" novalidate use:contractCreateEnhance>
		<HiddenIdField value={student.id} name="studentId" />

		<fieldset>
			<legend>Contract</legend>
			<ContractFormFields form={$contractCreateForm} errors={$contractCreateErrors} />
		</fieldset>

		<fieldset>
			<legend>People involved</legend>
			<ServiceFormFields
				form={$contractCreateForm}
				errors={$contractCreateErrors}
				{planners}
				{essayAdvisors}
				{specialPeople}
			/>
		</fieldset>
		<FormSubmit message={$contractCreateMessae} />
	</form>
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
