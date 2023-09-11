<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ContractServiceSchema } from '$lib/schemas';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import ContractFormFields from '$lib/components/ContractFormFields.svelte';
	import ServiceFormFields from '$lib/components/ServiceFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import type { UserListItem } from '$lib/types/userTypes';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<ContractServiceSchema>;
	export let planners: UserListItem[];
	export let essayAdvisors: UserListItem[];
	export let specialPeople: UserListItem[];

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend>Contract</legend>
		<HiddenIdField value={studentId} name="studentId" />

		<ContractFormFields form={$form} errors={$errors} />
	</fieldset>

	<fieldset>
		<legend>CF people</legend>
		<ServiceFormFields form={$form} errors={$errors} {planners} {essayAdvisors} {specialPeople} />
	</fieldset>
	<FormSubmit message={$message} />
</form>
