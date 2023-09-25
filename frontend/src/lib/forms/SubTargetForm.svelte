<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SubTargetSchema } from '$lib/schemas';
	import type { SubTarget } from '$lib/types/subTargetTypes';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ProgramType } from '$lib/types/programTypes';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';
	import { NONUG_PLANS, UG_PLANS } from '$lib/constants/admissionPlans';
	import { TIMEZONES } from '$lib/constants/timezones';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<SubTargetSchema>;
	export let action: string;
	export let targetId: number;
	export let programType: ProgramType;
	export let subTarget: SubTarget | undefined = undefined;

	const { form, errors, message, enhance } = superForm(data, {
		id: `${action}-${subTarget?.id}`,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	if (subTarget) {
		$form = { ...$form, ...subTarget };
		targetId = subTarget.target;
	}

	$: isUndergraduate = ['UG Freshman', 'UG Transfer'].includes(programType);
	$: admissionPlans = isUndergraduate ? UG_PLANS : NONUG_PLANS;
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />

		<HiddenIdField id="id" name="id" value={$form.id} />
		<HiddenIdField id="target-id" name="target" value={targetId} />

		<FormSelect
			id="admission-plan-select"
			name="admission_plan"
			label="Admission plan"
			form={$form}
			errors={$errors}
		>
			<OptionList options={subTarget ? [subTarget.admission_plan] : Array.from(admissionPlans)} />
		</FormSelect>
	</fieldset>

	<fieldset>
		<FormDateInput
			id="deadline-date-input"
			name="deadline_date"
			label="Deadline"
			form={$form}
			errors={$errors}
		/>
		<input
			id="deadline-time-input"
			class="input"
			type="time"
			name="deadline_time"
			bind:value={$form.deadline_time}
		/>

		<FormSelect
			id="timezone-select"
			name="deadline_timezone"
			label="Deadline timezone"
			form={$form}
			errors={$errors}
		>
			<OptionList options={Array.from(TIMEZONES)} />
		</FormSelect>
	</fieldset>

	<fieldset>
		<FormDateInput
			id="decision-date-input"
			name="decision_date"
			label="Decision date"
			form={$form}
			errors={$errors}
		/>
	</fieldset>

	<fieldset>
		<FormTextArea
			id="comments-input"
			name="comments"
			label="Comments"
			form={$form}
			errors={$errors}
			maxlength={1000}
		/>
	</fieldset>

	<FormSubmit message={$message} />
</form>
