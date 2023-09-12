<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ActScoreSchema } from '$lib/schemas';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<ActScoreSchema>;
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
		<FormTextInput
			id="math-input"
			name="math"
			label="Math"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="science-input"
			name="science"
			label="Science"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="english-input"
			name="english"
			label="English"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="reading-input"
			name="reading"
			label="Reading"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="writing-input"
			name="writing"
			label="Writing"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>
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
