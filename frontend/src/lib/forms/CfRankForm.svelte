<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { CfRankSchema } from '$lib/schemas';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<CfRankSchema>;
	export let action: string;
	export let targetId: number;

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
		<HiddenIdField id="target-id" name="id" value={targetId} />

		<FormTextInput
			id="cf-rank-input"
			name="cf_rank"
			label="CF rank"
			form={$form}
			errors={$errors}
		/>
	</fieldset>

	<FormSubmit message={$message} />
</form>
