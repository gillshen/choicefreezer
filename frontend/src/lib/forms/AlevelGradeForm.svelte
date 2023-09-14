<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { AlevelGradeSchema } from '$lib/schemas';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import { ALEVEL_EXAMS } from '$lib/constants/alevelExams';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<AlevelGradeSchema>;
	export let action: string;
	export let studentId: number;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />

		<HiddenIdField id="student-id" name="student" value={studentId} />

		<FormDateInput
			id="test-date-input"
			name="date"
			label="Test date"
			form={$form}
			errors={$errors}
			optional
		/>
	</fieldset>

	<fieldset>
		<FormSelect id="subject-select" name="subject" label="Subject" form={$form} errors={$errors}>
			<OptionList options={Array.from(ALEVEL_EXAMS)} />
		</FormSelect>

		<FormTextInput
			id="percentage-input"
			name="percentage"
			label="Percentage"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormSelect
			id="grade-select"
			name="grade"
			label="Grade"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		>
			<OptionList options={['A*', 'A', 'B', 'C', 'D']} insertNullRow />
		</FormSelect>
	</fieldset>

	<fieldset>
		<legend class="empty" />

		<FormTextArea
			id="comments-area"
			name="comments"
			label="Comments"
			form={$form}
			errors={$errors}
			optional
			maxlength={1000}
		/>
	</fieldset>

	<FormSubmit message={$message} />
</form>
