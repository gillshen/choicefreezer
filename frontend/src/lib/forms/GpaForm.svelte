<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { GpaSchema } from '$lib/schemas';
	import type { Gpa, Progression, TermOrYear } from '$lib/types/enrollmentTypes';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';

	import type { ProgramType } from '$lib/types/programTypes';
	import {
		ALL_PROGRESSIONS,
		HIGH_SCHOOL_PROGRESSIONS,
		MASTER_PROGRESSIONS,
		UG_PROGRESSIONS
	} from '$lib/constants/progressions';
	import { TERMS } from '$lib/constants/terms';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<GpaSchema>;
	export let action: string;
	export let enrollmentId: number | undefined = undefined;
	export let programType: ProgramType | undefined = undefined;
	export let gpa: Gpa | undefined = undefined;

	const { form, errors, message, enhance } = superForm(data, {
		id: `${action}-${gpa?.id}`,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	if (gpa) {
		$form = { ...$form, ...gpa };
		enrollmentId = gpa.enrollment;
	}

	let progressions: Progression[];
	let terms: TermOrYear[] = [
		...Array.from(TERMS).filter((term) => term !== 'Spring-Summer'),
		'Academic Year'
	];

	$: switch (programType) {
		case 'Pre-College':
			progressions = Array.from(HIGH_SCHOOL_PROGRESSIONS);
			break;
		case 'UG Freshman':
		case 'UG Transfer':
			progressions = Array.from(UG_PROGRESSIONS);
			break;
		case 'Master':
			progressions = Array.from(MASTER_PROGRESSIONS);
			break;
		default:
			progressions = Array.from(ALL_PROGRESSIONS);
	}
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />

		<HiddenIdField id="gpa-id" name="id" value={$form.id} />
		<HiddenIdField id="enrollment-id" name="enrollment" value={enrollmentId} />

		<FormSelect
			id="progression-select"
			name="progression"
			label="Progression"
			form={$form}
			errors={$errors}
		>
			<OptionList options={progressions} />
		</FormSelect>

		<FormSelect id="term-select" name="term" label="Term" form={$form} errors={$errors}>
			<OptionList options={terms} />
		</FormSelect>
	</fieldset>

	<fieldset>
		<legend class="empty" />
		<FormTextInput
			id="value-input"
			name="value"
			label="GPA"
			form={$form}
			errors={$errors}
			width="narrower"
		/>
		<FormTextInput
			id="scale-input"
			name="scale"
			label="GPA Scale"
			form={$form}
			errors={$errors}
			width="narrower"
		/>

		<FormCheckInput id="cumulative-check" name="is_cumulative" label="Cumulative" form={$form} />
	</fieldset>

	<FormSubmit message={$message} />
</form>
