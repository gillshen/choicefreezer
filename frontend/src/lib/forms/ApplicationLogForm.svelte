<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { NewApplicationLogSchema } from '$lib/schemas';
	import { APPLICATION_STATUSES } from '$lib/constants/applicationStatuses';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import OptionList from '$lib/components/OptionList.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<NewApplicationLogSchema>;
	export let action: string;
	export let applicationId: number;

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
		<HiddenIdField id="application-id" name="application" value={applicationId} />

		<FormSelect
			id="status-select"
			name="status"
			label="Application status"
			form={$form}
			errors={$errors}
		>
			<OptionList options={Array.from(APPLICATION_STATUSES)} />
		</FormSelect>

		<FormDateInput
			id="date-input"
			name="date"
			label="Date (to your best knowledge)"
			form={$form}
			errors={$errors}
		/>

		<FormTextArea
			id="comments-area"
			name="comments"
			label="Comments"
			form={$form}
			errors={$errors}
			maxlength={1000}
			optional
		/>
	</fieldset>

	<FormSubmit message={$message} />
</form>
