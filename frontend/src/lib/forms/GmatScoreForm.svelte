<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { GmatScoreSchema } from '$lib/schemas';
	import type { GmatScore } from '$lib/types/testScoreTypes';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<GmatScoreSchema>;
	export let action: string;
	export let studentId: number;
	export let score: GmatScore | undefined = undefined;

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
			id="total-input"
			name="total"
			label="Total"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="verbal-input"
			name="verbal"
			label="Verbal"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="quant-input"
			name="quant"
			label="Quantitative"
			form={$form}
			errors={$errors}
			optional
			width="narrower"
		/>

		<FormTextInput
			id="reasoning-input"
			name="reasoning"
			label="Integrated reasoning"
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
