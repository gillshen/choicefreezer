<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ApplicationUpdateSchema } from '$lib/schemas';
	import type { ProgramType } from '$lib/types/programTypes';
	import { UG_PLANS, NONUG_PLANS } from '$lib/constants/admissionPlans';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import MajorFormFields from '$lib/components/MajorFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let data: SuperValidated<ApplicationUpdateSchema>;
	export let programType: ProgramType;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	$: isUndergraduate = ['UG Freshman', 'UG Transfer'].includes(programType);
	$: admissionPlans = isUndergraduate ? UG_PLANS : NONUG_PLANS;
</script>

<form method="post" {action} novalidate use:enhance>
	<div class="-mb-8">
		<HiddenIdField id="application-id" value={$form.id} name="id" />
		<HiddenIdField id="target-id" value={$form.targetId} name="targetId" />
		<HiddenIdField id="first-major-id" value={$form.firstMajorId} name="firstMajorId" />
		<HiddenIdField id="second-major-id" value={$form.secondMajorId} name="secondMajorId" />
		<HiddenIdField id="third-major-id" value={$form.thirdMajorId} name="thirdMajorId" />
	</div>

	<fieldset>
		<legend class="empty" />

		<FormSelect
			id="admission-plan-select"
			name="admissionPlan"
			label="Admission plan"
			form={$form}
			errors={$errors}
		>
			{#each admissionPlans as admissionPlan}
				<option value={admissionPlan}>{admissionPlan}</option>
			{/each}
		</FormSelect>
	</fieldset>

	{#if isUndergraduate}
		<fieldset>
			<legend class="empty" />

			<MajorFormFields
				rank="First"
				majorFieldName="firstMajor"
				majorCategoryFieldName="firstMajorCategory"
				form={$form}
				errors={$errors}
			/>

			<div class="my-2" />

			<MajorFormFields
				rank="Second"
				majorFieldName="secondMajor"
				majorCategoryFieldName="secondMajorCategory"
				form={$form}
				errors={$errors}
			/>

			<div class="my-2" />

			<MajorFormFields
				rank="Third"
				majorFieldName="thirdMajor"
				majorCategoryFieldName="thirdMajorCategory"
				form={$form}
				errors={$errors}
			/>
		</fieldset>
	{/if}

	<FormSubmit message={$message} />
</form>
