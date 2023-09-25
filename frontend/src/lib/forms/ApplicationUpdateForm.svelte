<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { ApplicationUpdateSchema } from '$lib/schemas';
	import { UG_PLANS, NONUG_PLANS } from '$lib/constants/admissionPlans';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import MajorFormFields from '$lib/components/MajorFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	import { page } from '$app/stores';
	import { CURRENCIES } from '$lib/constants/currencies';
	import type { ApplicationLog } from '$lib/types/applicationLogTypes';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let data: SuperValidated<ApplicationUpdateSchema>;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		resetForm: true,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	$: application = $page.data.application;
	$: applicationId = application.id;
	$: programType = application.program.type;

	$: $form.targetId = application.target.id;

	$: $form.admissionPlan = application.subtarget.admission_plan;
	$: $form.scholarshipAmount = application.scholarship_amount;
	$: $form.scholarshipCurrency = application.scholarship_currency || 'USD';

	$: firstMajorChoice = $page.data.firstMajorChoice;
	$: secondMajorChoice = $page.data.secondMajorChoice;
	$: thirdMajorChoice = $page.data.thirdMajorChoice;

	$: if (firstMajorChoice) {
		$form.firstMajorId = firstMajorChoice.id;
		$form.firstMajor = firstMajorChoice.major;
		$form.firstMajorCategory = firstMajorChoice.major_category;
	}
	$: if (secondMajorChoice) {
		$form.secondMajorId = secondMajorChoice.id;
		$form.secondMajor = secondMajorChoice.major;
		$form.secondMajorCategory = secondMajorChoice.major_category;
	}
	$: if (thirdMajorChoice) {
		$form.thirdMajorId = thirdMajorChoice.id;
		$form.thirdMajor = thirdMajorChoice.major;
		$form.thirdMajorCategory = thirdMajorChoice.major_category;
	}

	$: isUndergraduate = ['UG Freshman', 'UG Transfer'].includes(programType);
	$: admissionPlans = isUndergraduate ? UG_PLANS : NONUG_PLANS;

	$: isAdmitted =
		application.logs.filter((log: ApplicationLog) => log.status === 'Admitted').length > 0;
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />

		<HiddenIdField id="application-id" value={applicationId} name="id" />
		<HiddenIdField id="target-id" value={$form.targetId} name="targetId" />
		<HiddenIdField id="major-1-id" value={$form.firstMajorId} name="firstMajorId" />
		<HiddenIdField id="major-2-id" value={$form.secondMajorId} name="secondMajorId" />
		<HiddenIdField id="major-3-id" value={$form.thirdMajorId} name="thirdMajorId" />

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
			<legend>Majors</legend>

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

	{#if isAdmitted}
		<fieldset>
			<legend>Scholarship awarded</legend>

			<div class="flex gap-4">
				<FormSelect
					id="scholarship-currency-select"
					name="scholarshipCurrency"
					label="Currency"
					form={$form}
					errors={$errors}
					width="narrower"
				>
					<OptionList options={CURRENCIES} />
				</FormSelect>

				<FormTextInput
					id="scholarship-amount-input"
					name="scholarshipAmount"
					label="Amount"
					form={$form}
					errors={$errors}
					width="narrower"
					placeholder="0"
				/>
			</div>
		</fieldset>
	{/if}

	<FormSubmit message={$message} />
</form>
