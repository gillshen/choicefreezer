<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { EnrollmentSchema } from '$lib/schemas';
	import type { Enrollment } from '$lib/types/enrollmentTypes';
	import type { School } from '$lib/types/schoolTypes';
	import type { ProgramType } from '$lib/types/programTypes';

	import { PROGRAM_TYPES } from '$lib/constants/programTypes';
	import {
		ALL_PROGRESSIONS,
		UG_PROGRESSIONS,
		HIGH_SCHOOL_PROGRESSIONS,
		MASTER_PROGRESSIONS
	} from '$lib/constants/progressions';
	import { CURRICULA } from '$lib/constants/curricula';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import { isUndergraduate } from '$lib/utils/programUtils';
	import { byName } from '$lib/utils/sortUtils';
	import FormDateInput from '$lib/components/FormDateInput.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<EnrollmentSchema>;
	export let schools: School[];
	export let enrollment: Enrollment | undefined = undefined;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	const sortedSchools = schools.sort(byName);

	let progressions: string[] = Array.from(ALL_PROGRESSIONS);
	let showCurriculumSelect = false;
	let showMajorsInput = false;

	function onProgramTypeChange() {
		if ($form.program_type === 'Pre-College') {
			showCurriculumSelect = true;
			showMajorsInput = false;
			progressions = Array.from(HIGH_SCHOOL_PROGRESSIONS);
		} else {
			showMajorsInput = true;
			showCurriculumSelect = false;

			if (isUndergraduate($form.program_type as ProgramType)) {
				progressions = Array.from(UG_PROGRESSIONS);
			} else if ($form.program_type === 'Master') {
				progressions = Array.from(MASTER_PROGRESSIONS);
			} else {
				progressions = Array.from(ALL_PROGRESSIONS);
			}
		}
	}

	$: {
		if (!showCurriculumSelect) $form.curriculum = '';
		if (!showMajorsInput) $form.majors = '';
	}

	if (enrollment) {
		$form = { ...$form, ...enrollment };
		onProgramTypeChange();
	}
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />
		<HiddenIdField id="enrollment-id" name="id" value={enrollment?.id ?? null} />
		<HiddenIdField id="student-id" name="student" value={studentId} />

		<FormSelect
			id="school-select"
			name="school"
			label="School"
			form={$form}
			errors={$errors}
			width="wider"
		>
			<OptionList options={sortedSchools} valueField="id" textField="name" />
		</FormSelect>

		<div class="flex flex-col">
			<label class="label" for="program-type-select">Program type</label>
			<select
				id="program-type-select"
				name="program_type"
				class="select wider"
				bind:value={$form.program_type}
				on:change={onProgramTypeChange}
			>
				<OptionList options={Array.from(PROGRAM_TYPES)} />
			</select>
		</div>
	</fieldset>

	<fieldset>
		<legend class="empty" />

		<FormDateInput
			id="start-date-input"
			name="start_date"
			label="Start date (day of the month irrelevant)"
			form={$form}
			errors={$errors}
		/>

		<FormSelect
			id="starting-progression-select"
			name="starting_progression"
			label="Starting progression"
			form={$form}
			errors={$errors}
		>
			{#each progressions as progression}
				<option value={progression}>{progression}</option>
			{/each}
		</FormSelect>
	</fieldset>

	<fieldset>
		<legend class="empty" />

		<FormDateInput
			id="end-date-input"
			name="end_date"
			label="End date"
			form={$form}
			errors={$errors}
			optional
		/>

		<FormSelect
			id="ending-progression-select"
			name="ending_progression"
			label="Ending progression"
			form={$form}
			errors={$errors}
			optional
		>
			{#each progressions as progression}
				<option value={progression}>{progression}</option>
			{/each}
		</FormSelect>
	</fieldset>

	<fieldset>
		<legend class="empty" />

		{#if showCurriculumSelect}
			<FormSelect
				id="curriculum-select"
				name="curriculum"
				label="Curriculum"
				form={$form}
				errors={$errors}
				optional
			>
				<OptionList options={Array.from(CURRICULA)} />
			</FormSelect>
		{/if}

		{#if showMajorsInput}
			<FormTextInput
				id="majors-input"
				name="majors"
				label="Majors"
				form={$form}
				errors={$errors}
				optional
			/>
		{/if}
	</fieldset>

	<FormSubmit message={$message} />
</form>
