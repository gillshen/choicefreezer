<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import PageSection from '$lib/components/PageSection.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import StudentIdField from '$lib/components/StudentIdField.svelte';
	import StudentLegalNameFields from '$lib/components/StudentLegalNameFields.svelte';
	import StudentRomanizedNameFields from '$lib/components/StudentRomanizedNameFields.svelte';
	import StudentGenderField from '$lib/components/StudentGenderField.svelte';
	import StudentCitizenshipField from '$lib/components/StudentCitizenshipField.svelte';
	import StudentDobField from '$lib/components/StudentDobField.svelte';
	import StudentResidenceFields from '$lib/components/StudentResidenceFields.svelte';
	import StudentCommentsField from '$lib/components/StudentCommentsField.svelte';
	import ContractFormFields from '$lib/components/ContractFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	import {
		formatStudentName,
		formatStudentRomanizedName,
		formatResidence
	} from '$lib/utils/studentUtils.js';

	export let data;
	const {
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

	// Forms

	const {
		form: legalNameForm,
		errors: legalNameErrors,
		message: legalNameMessage,
		enhance: legalNameEnhance
	} = superForm(data.legalNameForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});

	const {
		form: romanizedNameForm,
		errors: romanizedNameErrors,
		message: romanizedNameMessage,
		enhance: romanizedNameEnhance
	} = superForm(data.romanizedNameForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});

	const {
		form: genderForm,
		errors: genderErrors,
		message: genderMessage,
		enhance: genderEnhance
	} = superForm(data.genderForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});

	const {
		form: citizenshipForm,
		errors: citizenshipErrors,
		message: citizenshipMessage,
		enhance: citizenshipEnhance
	} = superForm(data.citizenshipForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});

	const {
		form: dateOfBirthForm,
		errors: dateOfBirthErrors,
		message: dateOfBirthMessage,
		enhance: dateOfBirthEnhance
	} = superForm(data.dateOfBirthForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});

	const {
		form: residenceForm,
		errors: residenceErrors,
		message: residenceMessage,
		enhance: residenceEnhance
	} = superForm(data.residenceForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});

	const {
		form: commentsForm,
		errors: commentsErrors,
		message: commentsMessage,
		enhance: commentsEnhance
	} = superForm(data.commentsForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});

	const {
		form: contractCreateForm,
		errors: contractCreateErrors,
		message: contractCreateMessae,
		enhance: contractCreateEnhance
	} = superForm(data.contractCreateForm, {
		scrollToError: 'auto',
		onUpdated: () => location.reload()
	});
</script>

<h1>{formatStudentName(student)}</h1>

<PageSection>
	<div class="student-profile-grid">
		<div class="key row-span-2">Name</div>
		<div class="value">
			{formatStudentName(student)}
			{#if userCanEdit}
				<button on:click={() => legalNameDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="value">
			{formatStudentRomanizedName(student)}
			{#if userCanEdit}
				<button on:click={() => romanizedNameDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="key">Gender</div>
		<div class="value">
			{student.gender}
			{#if userCanEdit}
				<button on:click={() => genderDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="key">Citizen of</div>
		<div class="value">
			{student.citizenship}
			{#if userCanEdit}
				<button on:click={() => citizenshipDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="key">Born</div>
		<div class="value">
			{student.date_of_birth ?? ''}
			{#if userCanEdit}
				<button on:click={() => dateOfBirthDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="key">Based in</div>
		<div class="value">
			{formatResidence(student)}
			{#if userCanEdit}
				<button on:click={() => residenceDialog.showModal()}>Edit</button>
			{/if}
		</div>

		<div class="key">Comments</div>
		<div class="value">
			{student.comments}
			{#if userCanEdit}
				<button on:click={() => commentsDialog.showModal()}>Edit</button>
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
			<StudentIdField form={$legalNameForm} errors={$legalNameErrors} />
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
			<StudentIdField form={$romanizedNameForm} errors={$romanizedNameErrors} />
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
			<StudentIdField form={$genderForm} errors={$genderErrors} />
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
			<StudentIdField form={$citizenshipForm} errors={$citizenshipErrors} />
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
			<StudentIdField form={$dateOfBirthForm} errors={$dateOfBirthErrors} />
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
			<StudentIdField form={$residenceForm} errors={$residenceErrors} />
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
			<StudentIdField form={$commentsForm} errors={$commentsErrors} />
			<StudentCommentsField form={$commentsForm} errors={$commentsErrors} />
		</fieldset>
		<FormSubmit message={$commentsMessage} />
	</form>
</Dialog>

<Dialog title="Create a contract" exitHelper bind:dialog={contractCreateDialog}>
	<!-- <SuperDebug data={$contractCreateForm} /> -->
	<form method="post" action="?/createContract" novalidate use:contractCreateEnhance>
		<fieldset>
			<legend class="empty" />
			<ContractFormFields form={$contractCreateForm} errors={$contractCreateErrors} />
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
