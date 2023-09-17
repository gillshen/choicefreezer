<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { DetScoreSchema } from '$lib/schemas';
	import type { DetScore } from '$lib/types/testScoreTypes';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<DetScoreSchema>;
	export let action: string;
	export let studentId: number;
	export let score: DetScore | undefined = undefined;

	const { form, errors, message, enhance } = superForm(data, {
		id: `${action}-${score?.id}`,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	if (score) {
		$form = { ...$form, ...score };
		studentId = score.student;
	}
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />

		<HiddenIdField id="score-id" name="id" value={$form.id} />
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
			id="overall-input"
			name="overall"
			label="Overall"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="literacy-input"
			name="literacy"
			label="Literacy"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="comprehension-input"
			name="comprehension"
			label="Comprehension"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="conversation-input"
			name="conversation"
			label="Conversation"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="production-input"
			name="production"
			label="Production"
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
