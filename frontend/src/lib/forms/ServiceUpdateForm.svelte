<script lang="ts">
	import type { ServiceSchema } from '$lib/schemas';
	import type { Service } from '$lib/types/contractTypes';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	export let dialog: HTMLDialogElement | undefined;

	export let service: Service;
	export let data: SuperValidated<ServiceSchema>;
	export let action: string;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	$form.start_date = service.start_date;
	$form.end_date = service.end_date;
</script>

<form method="post" {action}>
	<fieldset>
		<legend class="empty" />

		<HiddenIdField id="contract-id" name="contract" value={service.contract} />
		<HiddenIdField id="service-id" name="id" value={service.id} />
		<HiddenIdField id="cf-person-id" name="cf_person" value={service.cf_person} />
		<HiddenIdField id="role" name="role" value={service.role} />

		<p class="font-bold font-heading-token">{service.cf_username}</p>

		<FormDateInput
			id="start-date-input"
			name="start_date"
			label="Start date"
			form={$form}
			errors={$errors}
			optional
		/>

		<FormDateInput
			id="end-date-input"
			name="end_date"
			label="End date"
			form={$form}
			errors={$errors}
			optional
		/>
	</fieldset>

	<FormSubmit message={$message} />
</form>
