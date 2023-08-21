<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ApplicationSchema } from '$lib/schemas';
	import type { School } from '$lib/types/schoolTypes';
	import type { ProgramSelectItem } from '$lib/types/programTypes';
	import { PROGRAM_TYPES } from '$lib/constants/programTypes';
	import { UG_PLANS, NONUG_PLANS } from '$lib/constants/admissionPlans';
	import { getYearOptions } from '$lib/utils/dateUtils';
	import { TERMS } from '$lib/constants/terms';

	import { closeAndReloadOnSuccess } from '$lib/utils/formUtils';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	import { byName } from '$lib/utils/sortUtils';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import MajorFormFields from '$lib/components/MajorFormFields.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let data: SuperValidated<ApplicationSchema>;
	export let schools: School[];
	export let programs: ProgramSelectItem[];

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: closeAndReloadOnSuccess(dialog)
	});

	// The unselected state
	$form.programId = -1;

	let isJointProgram = false;

	const sortedSchools = schools.sort(byName);

	function programsFilter(program: ProgramSelectItem): boolean {
		if (!program.schools.includes($form.schoolId)) {
			return false;
		}
		if (isJointProgram && !program.schools.includes($form.secondSchoolId || -1)) {
			return false;
		}
		if (!(program.type === $form.programType)) {
			return false;
		}
		return true;
	}

	let filteredPrograms = programs.filter(programsFilter);

	let filtersSet = false;

	// True if and only if the filters are set but no program matches
	let programNotFound = false;

	let addProgramEnabled = false;

	function onFiltersChange() {
		filteredPrograms = programs.filter(programsFilter);

		const firstSchoolSelected = !!$form.schoolId;
		const secondSchoolFulfilled = !isJointProgram || !!$form.secondSchoolId;
		const programTypeSelected = !!$form.programType;
		const filteredProgramsEmpty = filteredPrograms.length === 0;
		const userWantsToAdd = $form.programId === 0;

		filtersSet = firstSchoolSelected && secondSchoolFulfilled && programTypeSelected;
		programNotFound = filtersSet && filteredProgramsEmpty;
		addProgramEnabled = programNotFound || userWantsToAdd;
	}

	function onJointProgramChange() {
		$form.programId = -1;
		$form.secondSchoolId = isJointProgram ? -1 : 0;
		onFiltersChange();
	}

	function onSchoolChange() {
		$form.programId = -1;
		$errors.schoolId = [];
		onFiltersChange();
	}

	function onSecondSchoolChange() {
		$form.programId = -1;
		$errors.secondSchoolId = [];
		onFiltersChange();
	}

	function onProgramTypeChange() {
		$form.programId = -1;
		$errors.programType = [];
		onFiltersChange();
	}

	function onProgramChange() {
		$errors.programId = [];
		onFiltersChange();
	}

	$: isUndergraduate = ['UG Freshman', 'UG Transfer'].includes($form.programType);

	$: admissionPlans = !$form.programType ? [] : isUndergraduate ? UG_PLANS : NONUG_PLANS;

	let showSecondMajor = false;
	let showThirdMajor = false;
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend>Choose a program</legend>

		<div class="flex gap-4">
			<input
				id="joint-program-check"
				type="checkbox"
				class="checkbox"
				bind:checked={isJointProgram}
				on:change={onJointProgramChange}
			/>
			<label class="label" for="joint-program-check">This is a joint program</label>
		</div>

		<div class="flex flex-col">
			<label class="label" for="school-select">Host school{isJointProgram ? ' 1' : ''}</label>
			<select
				id="school-select"
				name="schoolId"
				class="select"
				bind:value={$form.schoolId}
				on:change={onSchoolChange}
			>
				<OptionList options={sortedSchools} valueField="id" textField="name" />
			</select>
			{#if $errors.schoolId}
				<small class="error-message">{$errors.schoolId}</small>
			{/if}
		</div>

		{#if isJointProgram}
			<div class="flex flex-col">
				<label class="label" for="second-school-select">Host school 2</label>
				<select
					id="second-school-select"
					name="secondSchoolId"
					class="select"
					bind:value={$form.secondSchoolId}
					on:change={onSecondSchoolChange}
				>
					<!--
						To allow -1 to be submitted for this nonnegative field so as
						to generate an error message when user fails to select a value
					-->
					<option value={-1} />
					<OptionList options={sortedSchools} valueField="id" textField="name" />
				</select>
				{#if $errors.secondSchoolId}
					<small class="error-message">{$errors.secondSchoolId}</small>
				{/if}
			</div>
		{/if}

		<!-- spacer -->
		<div class="my-2" />

		<div class="flex flex-col">
			<label class="label" for="program-type-select">Choose a program type</label>
			<select
				id="program-type-select"
				name="programType"
				class="select"
				bind:value={$form.programType}
				on:change={onProgramTypeChange}
			>
				<OptionList options={Array.from(PROGRAM_TYPES)} />
			</select>
			{#if $errors.programType}
				<small class="error-message">{$errors.programType}</small>
			{/if}
		</div>

		<div class="flex flex-col">
			<label class="label flex flex-col" for="program-select">
				Choose a program
				{#if filteredPrograms.length}
					<small>
						If you do not find the program you are looking for, select "Add a program..." at the
						bottom
					</small>
				{/if}
			</label>
			<select
				id="program-select"
				name="programId"
				class="select"
				bind:value={$form.programId}
				disabled={programNotFound}
				on:change={onProgramChange}
			>
				<option value={-1} />
				{#each filteredPrograms as program}
					<option value={program.id}>{program.display_name}</option>
				{/each}
				{#if programNotFound}
					<option value={-2} disabled class="text-surface-400">No such program found</option>
				{:else if filtersSet}
					<option value={0} class="text-primary-500">Add a program...</option>
				{/if}
			</select>
			{#if $errors.programId}
				<small class="error-message">{$errors.programId}</small>
			{/if}
		</div>

		{#if addProgramEnabled}
			<FormTextInput
				id="program-name-input"
				name="programName"
				label="Name of the program"
				form={$form}
				errors={$errors}
				optional
			/>

			<FormTextInput
				id="program-degree-input"
				name="programDegree"
				label="Degree awarded by the program"
				form={$form}
				errors={$errors}
				optional
			/>
		{/if}
	</fieldset>

	<fieldset>
		<legend>Choose an admission plan</legend>

		<FormSelect id="year-select" name="year" label="Year" form={$form} errors={$errors}>
			<OptionList options={getYearOptions()} />
		</FormSelect>

		<FormSelect id="term-select" name="term" label="Term" form={$form} errors={$errors}>
			<OptionList options={Array.from(TERMS)} />
		</FormSelect>

		<FormSelect
			id="admission-plan-select"
			name="admissionPlan"
			label="Admission plan"
			form={$form}
			errors={$errors}
		>
			{#each admissionPlans as admissionPlan}
				<option value={admissionPlan}>{admissionPlan}</option>
			{/each}
		</FormSelect>
	</fieldset>

	{#if isUndergraduate}
		<fieldset>
			<legend>Specify majors</legend>

			<MajorFormFields
				rank="First"
				majorFieldName="firstMajor"
				majorCategoryFieldName="firstMajorCategory"
				form={$form}
				errors={$errors}
			/>

			{#if !showSecondMajor}
				<div class="major-button-container">
					<button type="button" class="major-button" on:click={() => (showSecondMajor = true)}
						>Add a second major</button
					>
				</div>
			{/if}

			{#if showSecondMajor}
				<div class="my-2" />
				<MajorFormFields
					rank="Second"
					majorFieldName="secondMajor"
					majorCategoryFieldName="secondMajorCategory"
					form={$form}
					errors={$errors}
				/>

				{#if !showThirdMajor}
					<div class="major-button-container">
						<button type="button" class="major-button" on:click={() => (showThirdMajor = true)}
							>Add a third major</button
						>
						<button
							type="button"
							class="major-button remove"
							on:click={() => (showSecondMajor = false)}>Remove</button
						>
					</div>
				{/if}
			{/if}

			{#if showThirdMajor}
				<div class="my-2" />

				<MajorFormFields
					rank="Third"
					majorFieldName="thirdMajor"
					majorCategoryFieldName="thirdMajorCategory"
					form={$form}
					errors={$errors}
				/>

				<div class="major-button-container">
					<button
						type="button"
						class="major-button remove"
						on:click={() => (showThirdMajor = false)}>Remove</button
					>
				</div>
			{/if}
		</fieldset>
	{/if}

	<FormSubmit message={$message} />
</form>

<style lang="postcss">
	.major-button-container {
		@apply mt-2 flex gap-4;
	}
	button.major-button {
		@apply max-w-fit py-2 px-4;
		@apply text-primary-500;
		border: 1px solid;
		@apply border-primary-500;
	}
	button.major-button.remove {
		@apply text-surface-50 bg-error-700;
		border: none;
	}
</style>