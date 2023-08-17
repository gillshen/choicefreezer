<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ComponentType } from 'svelte';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import { closeAndReloadOnSuccess } from '$lib/utils/formUtils';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let fields: ComponentType;
	export let data: SuperValidated<any>;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		onResult: closeAndReloadOnSuccess(dialog!)
	});
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />
		<HiddenIdField value={studentId} />
		<svelte:component this={fields} form={$form} errors={$errors} />
	</fieldset>
	<FormSubmit message={$message} />
</form>
