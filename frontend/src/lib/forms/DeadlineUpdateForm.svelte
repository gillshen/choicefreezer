<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { DeadlineUpdateSchema } from '$lib/schemas';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import { TIMEZONES } from '$lib/constants/timezones';

	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import OptionList from '$lib/components/OptionList.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<DeadlineUpdateSchema>;
	export let action: string;

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
			id="deadline-date-input"
			name="deadline_date"
			label="Deadline"
			form={$form}
			errors={$errors}
		/>
		<input class="input" type="time" name="deadline_time" bind:value={$form.deadline_time} />

		<FormSelect
			id="timezone-select"
			name="deadline_timezone"
			label="Timezone"
			form={$form}
			errors={$errors}
		>
			<OptionList options={Array.from(TIMEZONES)} />
		</FormSelect>
	</fieldset>
	<FormSubmit message={$message} />
</form>
