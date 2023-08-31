<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewUserLogSchema } from '$lib/schemas';
	import type { StudentOfUser } from '$lib/types/userTypes';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import { currentDateString } from '$lib/utils/dateUtils';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<NewUserLogSchema>;
	export let action: string;
	export let userId: number;
	export let students: StudentOfUser[];

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	if (!$form.date) {
		$form.date = currentDateString();
	}
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />
		<HiddenIdField id="user-id" name="author" value={userId} />

		<FormDateInput id="log-date-input" name="date" label="Date" form={$form} errors={$errors} />

		<FormSelect
			id="relevant-student-select"
			name="relevant_student"
			label="Relevant student"
			form={$form}
			errors={$errors}
			optional
		>
			<OptionList options={students} valueField="id" textField="name" insertNullRow />
		</FormSelect>

		<FormTextInput
			id="log-title-input"
			name="title"
			label="Title"
			form={$form}
			errors={$errors}
			maxlength={100}
			optional
		/>

		<FormTextArea
			id="log-text-area"
			name="text"
			label="Text"
			form={$form}
			errors={$errors}
			maxlength={1000}
			showCharCount
		/>
	</fieldset>

	<fieldset class="flex flex-col gap-0">
		<FormCheckInput id="log-pinned-check" name="pinned" label="Pin at the top" form={$form} />

		<FormCheckInput
			id="log-public-check"
			name="public"
			label="Make publicly visible"
			form={$form}
		/>

		<FormCheckInput id="log-public-check" name="public" label="Freeze this entry" form={$form} />
	</fieldset>
	<FormSubmit message={$message} />
</form>
