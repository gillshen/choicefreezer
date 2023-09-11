<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ServiceSchema } from '$lib/schemas';
	import type { UserListItem } from '$lib/types/userTypes';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import { CF_ROLES } from '$lib/constants/cfRoles';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<ServiceSchema>;
	export let action: string;
	export let contractId: number;
	export let cfPeople: UserListItem[];

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

		<HiddenIdField id="contract-id" name="contract" value={contractId} />

		<FormSelect
			id="cf-person-select"
			name="cf_person"
			label="CF person"
			form={$form}
			errors={$errors}
		>
			<OptionList options={cfPeople} valueField="id" textField="username" />
		</FormSelect>

		<FormSelect id="role-select" name="role" label="Role" form={$form} errors={$errors}>
			<OptionList options={Array.from(CF_ROLES)} />
		</FormSelect>

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
