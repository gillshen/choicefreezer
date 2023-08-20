<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ApplicationSchema } from '$lib/schemas';
	import type { School } from '$lib/types/schoolTypes';
	import type { ProgramSelectItem } from '$lib/types/programTypes';
	import { PROGRAM_TYPES } from '$lib/constants/programTypes';

	import { closeAndReloadOnSuccess } from '$lib/utils/formUtils';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	import { byName } from '$lib/utils/sortUtils';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let data: SuperValidated<ApplicationSchema>;
	export let schools: School[];
	export let programs: ProgramSelectItem[];

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(dialog!)
	});

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

	const onJointProgramChange = () => {
		$form.programId = null;
		onFiltersChange();
	};

	const onSchoolChange = () => {
		$form.programId = null;
		onFiltersChange();
	};

	const onProgramTypeChange = () => {
		$form.programId = null;
		onFiltersChange();
	};

	const onFiltersChange = () => {
		filteredPrograms = programs.filter(programsFilter);

		const firstSchoolSelected = !!$form.schoolId;
		const secondSchoolFulfilled = !isJointProgram || !!$form.secondSchoolId;
		const programTypeSelected = !!$form.programType;
		const filteredProgramsEmpty = filteredPrograms.length === 0;
		const userWantsToAdd = $form.programId === -1;

		filtersSet = firstSchoolSelected && secondSchoolFulfilled && programTypeSelected;
		programNotFound = filtersSet && filteredProgramsEmpty;
		addProgramEnabled = programNotFound || userWantsToAdd;
	};
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
					on:change={onSchoolChange}
				>
					<OptionList options={sortedSchools} valueField="id" textField="name" />
				</select>
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
						If you do not find the program you are looking for, select the last option "Add a
						program..."
					</small>
				{/if}
			</label>
			<select
				id="program-select"
				name="programId"
				class="select"
				bind:value={$form.programId}
				disabled={programNotFound}
				on:change={onFiltersChange}
			>
				{#each filteredPrograms as program}
					<option value={program.id}>{program.display_name}</option>
				{/each}
				{#if programNotFound}
					<option value={null} disabled class="text-surface-400">No such program found</option>
				{:else if filtersSet}
					<option value={-1} class="add-program-option">Add a program...</option>
				{/if}
			</select>
		</div>

		{#if addProgramEnabled}
			<section>(add a program)</section>
		{/if}
	</fieldset>

	<FormSubmit message={$message} />
</form>

<style lang="postcss">
	.add-program-option {
		@apply text-primary-500;
	}
</style>
