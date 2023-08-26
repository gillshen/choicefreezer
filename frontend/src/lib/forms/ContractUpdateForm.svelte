<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ContractUpdateSchema } from '$lib/schemas';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import ContractFormFields from '$lib/components/ContractFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let data: SuperValidated<ContractUpdateSchema>;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});
</script>

<form method="post" {action} novalidate use:enhance>
	<HiddenIdField value={$form.id} name="id" />
	<fieldset>
		<ContractFormFields form={$form} errors={$errors} />
	</fieldset>

	<FormSubmit message={$message} />
</form>
