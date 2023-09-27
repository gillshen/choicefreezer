<script lang="ts">
	import type { ServiceSchema } from '$lib/schemas';
	import type { Service } from '$lib/types/contractTypes';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	import { closeDialogOnSuccess } from '$lib/utils/formUtils';

	export let dialog: HTMLDialogElement | undefined;

	export let service: Service;
	export let data: SuperValidated<ServiceSchema>;
	export let action: string;

	const { form, errors, message, enhance } = superForm(data, {
		id: action,
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, dialog!)
	});

	$form.start_date = service.start_date;
	$form.end_date = service.end_date;

	let hideStartDate = !service.start_date;
	let hideEndDate = !service.end_date;

	$: if (hideStartDate) {
		$form.start_date = null;
	}

	$: if (hideEndDate) {
		$form.end_date = null;
	}
</script>

<form method="post" {action}>
	<fieldset class="h-[350px]">
		<legend class="empty" />

		<HiddenIdField id="contract-id" name="contract" value={service.contract} />
		<HiddenIdField id="service-id" name="id" value={service.id} />
		<HiddenIdField id="cf-person-id" name="cf_person" value={service.cf_person} />
		<HiddenIdField id="role" name="role" value={service.role} />

		<p class="font-bold font-heading-token">{service.cf_username}</p>

		<div class="flex flex-row gap-4 items-start mt-2">
			<input id="hide-start-date" type="checkbox" class="checkbox" bind:checked={hideStartDate} />
			<label class="label !pt-0 !-mt-0.5 max-w-md" for="hide-start-date"
				>Start date same as the contract start date</label
			>
		</div>

		{#if !hideStartDate}
			<FormDateInput
				id="start-date-input"
				name="start_date"
				label="Start date"
				form={$form}
				errors={$errors}
			/>
		{/if}

		<div class="flex flex-row gap-4 items-start mt-2">
			<input id="hide-end-date" type="checkbox" class="checkbox" bind:checked={hideEndDate} />
			<label class="label !pt-0 !-mt-0.5 max-w-md" for="hide-end-date"
				>End date same as the contract end date</label
			>
		</div>

		{#if !hideEndDate}
			<FormDateInput
				id="end-date-input"
				name="end_date"
				label="End date"
				form={$form}
				errors={$errors}
				optional
				optionalText="if not the end of the contract"
			/>
		{/if}
	</fieldset>

	<FormSubmit message={$message} />
</form>
