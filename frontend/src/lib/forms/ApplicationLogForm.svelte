<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import type { NewApplicationLogSchema } from '$lib/schemas';
	import { APPLICATION_STATUSES } from '$lib/constants/applicationStatuses';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormTextArea from '$lib/components/FormTextArea.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import OptionList from '$lib/components/OptionList.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import { CURRENCIES } from '$lib/constants/currencies';

	export let dialog: HTMLDialogElement | undefined;
	export let data: SuperValidated<NewApplicationLogSchema>;
	export let action: string;
	export let applicationId: number;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	let showAdmissionFields = false;
	let altAdmitted = false;
	let awardedScholarship = false;

	function onStatusSelected() {
		showAdmissionFields = $form.status === 'Admitted';
	}

	$form.scholarshipCurrency = 'USD';
</script>

<form method="post" {action} novalidate use:enhance>
	<fieldset>
		<legend class="empty" />
		<HiddenIdField id="application-id" name="application" value={applicationId} />

		<FormSelect
			id="status-select"
			name="status"
			label="Application status"
			form={$form}
			errors={$errors}
			onChange={onStatusSelected}
		>
			<OptionList options={Array.from(APPLICATION_STATUSES)} />
		</FormSelect>

		<FormDateInput
			id="date-input"
			name="date"
			label="Date (to your best knowledge)"
			form={$form}
			errors={$errors}
		/>

		{#if showAdmissionFields}
			<div class="flex flex-col gap-4 my-4">
				<div class="flex gap-4 items-center">
					<input
						id="alt-admitted-check"
						type="checkbox"
						class="checkbox"
						bind:checked={altAdmitted}
					/>
					<label class="label !max-w-[28rem]" for="alt-admitted-check"
						>Admitted to a different program than the one applied to</label
					>
				</div>

				{#if altAdmitted}
					<p class="max-w-[24rem] text-warning-400">
						This feature has not yet been implemented. Please contact the site admin for assistance.
					</p>
				{/if}

				<div class="flex gap-4 items-center">
					<input
						id="scholarship-check"
						type="checkbox"
						class="checkbox"
						bind:checked={awardedScholarship}
					/>
					<label class="label !max-w-[28rem]" for="scholarship-check">Awarded scholarship</label>
				</div>

				{#if awardedScholarship}
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
				{/if}
			</div>
		{/if}

		<FormTextArea
			id="comments-area"
			name="comments"
			label="Comments"
			form={$form}
			errors={$errors}
			maxlength={1000}
			optional
		/>
	</fieldset>

	<FormSubmit message={$message} />
</form>
