<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ClassRankSchema } from '$lib/schemas';
	import type { ClassRank, Progression, TermOrYear } from '$lib/types/enrollmentTypes';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';

	import type { ProgramType } from '$lib/types/programTypes';
	import {
		ALL_PROGRESSIONS,
		HIGH_SCHOOL_PROGRESSIONS,
		MASTER_PROGRESSIONS,
		UG_PROGRESSIONS
	} from '$lib/constants/progressions';
	import { TERMS } from '$lib/constants/terms';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<ClassRankSchema>;
	export let action: string;
	export let enrollmentId: number | undefined = undefined;
	export let programType: ProgramType | undefined = undefined;
	export let classRank: ClassRank | undefined = undefined;

	const { form, errors, message, enhance } = superForm(data, {
		id: `${action}-${classRank?.id}`,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	if (classRank) {
		$form = { ...$form, ...classRank };
		enrollmentId = classRank.enrollment;
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

		<HiddenIdField id="rank-id" name="id" value={$form.id} />
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

		<div class="flex gap-6 items-baseline">
			<FormTextInput
				id="rank-input"
				name="rank"
				label="Rank"
				form={$form}
				errors={$errors}
				optional
				width="narrower"
				placeholder="E.g. 12"
			/>

			<div>or</div>

			<FormTextInput
				id="top-x-input"
				name="top_x"
				label="Top %"
				form={$form}
				errors={$errors}
				optional
				width="narrower"
				placeholder="E.g. 10"
			/>
		</div>

		<FormTextInput
			id="class-size-input"
			name="class_size"
			label="Class size"
			form={$form}
			errors={$errors}
			optional={!$form.rank}
			width="narrower"
			placeholder="E.g. 120"
		/>
	</fieldset>

	<FormSubmit message={$message} />
</form>
