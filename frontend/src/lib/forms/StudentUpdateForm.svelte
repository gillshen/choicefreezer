<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { StudentUpdateSchema } from '$lib/schemas';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import StudentLegalNameFields from '$lib/components/StudentLegalNameFields.svelte';
	import StudentRomanizedNameFields from '$lib/components/StudentRomanizedNameFields.svelte';
	import StudentGenderField from '$lib/components/StudentGenderField.svelte';
	import StudentCitizenshipField from '$lib/components/StudentCitizenshipField.svelte';
	import StudentDobField from '$lib/components/StudentDobField.svelte';
	import StudentResidenceFields from '$lib/components/StudentResidenceFields.svelte';
	import StudentCommentsField from '$lib/components/StudentCommentsField.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let data: SuperValidated<StudentUpdateSchema>;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend>Legal name</legend>
		<HiddenIdField value={$form.id} name="id" />
		<StudentLegalNameFields form={$form} errors={$errors} />
	</fieldset>

	<fieldset>
		<legend>English name</legend>
		<StudentRomanizedNameFields form={$form} errors={$errors} />
	</fieldset>

	<fieldset class="single-column">
		<legend>Personal information</legend>
		<StudentGenderField form={$form} errors={$errors} />
		<StudentCitizenshipField form={$form} errors={$errors} />
		<StudentDobField form={$form} errors={$errors} />
	</fieldset>

	<fieldset>
		<legend>Residence</legend>
		<StudentResidenceFields form={$form} errors={$errors} />
	</fieldset>

	<fieldset class="fullwidth">
		<legend>Comments</legend>
		<StudentCommentsField form={$form} errors={$errors} showLabel={false} />
	</fieldset>

	<FormSubmit message={$message} />
</form>

<style lang="postcss">
	fieldset {
		@apply grid grid-cols-[minmax(20rem,1fr)_minmax(20rem,1fr)] gap-8 gap-y-4;
	}
	fieldset.single-column {
		@apply grid grid-cols-1 max-w-[20rem];
	}
	fieldset.fullwidth {
		@apply grid grid-cols-1 max-w-prose;
	}
</style>
