<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { DecisionDateUpdateSchema } from '$lib/schemas';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<DecisionDateUpdateSchema>;
	export let action: string;
	export let admissionPlan: string;

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
		<HiddenIdField id="subtarget-id" name="id" value={$form.id} />

		<FormDateInput
			id="decision-date-input"
			name="decision_date"
			label={`${admissionPlan} decision date`}
			form={$form}
			errors={$errors}
		/>
	</fieldset>
	<FormSubmit message={$message} />
</form>
