<script lang="ts">
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import OptionList from '$lib/components/OptionList.svelte';

	import { CONTRACT_TYPES } from '$lib/constants/contractTypes';
	import { getYearOptions } from '$lib/utils/dateUtils';
	import { ALL_PROGRESSIONS } from '$lib/constants/progressions';
	import { CONTRACT_STATUSES } from '$lib/constants/contractStatuses';

	export let form: any;
	export let errors: any;
</script>

<FormSelect id="contract-type-select" name="type" label="Type" {form} {errors}>
	<OptionList options={CONTRACT_TYPES} />
</FormSelect>

<FormSelect id="target-year-select" name="target_year" label="Target year of entry" {form} {errors}>
	<OptionList options={getYearOptions()} />
</FormSelect>

<FormDateInput
	id="contract-date-input"
	name="date_signed"
	label="Date signed"
	{form}
	{errors}
	optional
/>

<FormSelect
	id="progression-select"
	name="student_progression_at_signing"
	label="Student progression at signing"
	{form}
	{errors}
	optional
>
	<OptionList options={ALL_PROGRESSIONS} />
</FormSelect>

<FormSelect id="contract-status-select" name="status" label="Status" {form} {errors}>
	<OptionList options={CONTRACT_STATUSES} />
</FormSelect>
