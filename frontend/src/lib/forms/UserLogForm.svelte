<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { SuperValidated } from 'sveltekit-superforms';
	import type { NewUserLogSchema } from '$lib/schemas';
	import type { StudentOfUser } from '$lib/types/userTypes';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';
	import { currentDateString } from '$lib/utils/dateUtils';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<NewUserLogSchema>;
	export let action: string;
	export let userId: number;
	export let students: StudentOfUser[];

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	$: isTodo = $form.isTodo;

	$form.date ||= currentDateString();
	$form.task_due ||= '18:00';
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />

		<div class="flex flex-row gap-4 items-start mt-2">
			<input
				id="todo-check"
				name="isTodo"
				type="checkbox"
				class="checkbox"
				bind:checked={$form.isTodo}
				on:change={() => (isTodo = $form.isTodo)}
			/>
			<label class="label !pt-0 !-mt-0.5" for="todo-check">This is a TODO item</label>
		</div>
	</fieldset>

	<fieldset>
		<legend class="empty" />
		<HiddenIdField id="user-id" name="author" value={userId} />

		<FormDateInput
			id="log-date-input"
			name="date"
			label={isTodo ? 'Task due' : 'Date'}
			form={$form}
			errors={$errors}
		/>

		{#if isTodo}
			<input
				id="log-task-due-input"
				class="input"
				type="time"
				name="task_due"
				bind:value={$form.task_due}
			/>
		{/if}

		<FormSelect
			id="relevant-student-select"
			name="relevant_student"
			label="Relevant student"
			form={$form}
			errors={$errors}
			optional
		>
			<OptionList options={students} valueField="id" textField="name" insertNullRow />
		</FormSelect>

		<FormTextInput
			id="log-title-input"
			name="title"
			label="Title"
			form={$form}
			errors={$errors}
			maxlength={100}
			optional
		/>

		<FormTextArea
			id="log-text-area"
			name="text"
			label="Details"
			form={$form}
			errors={$errors}
			maxlength={1000}
			showCharCount
		/>

		<FormCheckInput id="log-pinned-check" name="pinned" label="Pin at the top" form={$form} />

		<FormCheckInput id="log-shared-check" name="shared" label="Post to the Commons" form={$form} />
	</fieldset>

	<FormSubmit message={$message} />
</form>
