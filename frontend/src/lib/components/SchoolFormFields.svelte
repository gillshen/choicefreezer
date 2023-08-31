<script lang="ts">
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormTextInput from './FormTextInput.svelte';
	import OptionList from './OptionList.svelte';
	import { COUNTRIES } from '$lib/constants/countries';
	import { SCHOOL_TYPES } from '$lib/constants/schoolTypes';
	import { byNameChinaFirst } from '$lib/utils/sortUtils';

	export let form: any;
	export let errors: any;
</script>

<fieldset>
	<legend class="empty" />

	<FormSelect id="country-select" name="country" label="Country" {form} {errors}>
		<OptionList options={COUNTRIES.sort(byNameChinaFirst)} />
	</FormSelect>

	<FormSelect id="type-select" name="type" label="Type" {form} {errors}>
		<OptionList options={Array.from(SCHOOL_TYPES)} />
	</FormSelect>

	<FormTextInput id="name-input" name="name" label="Full name" {form} {errors} width="wider" />

	<FormTextInput
		id="abbreviation-input"
		name="abbreviation"
		label="Abbreviation"
		{form}
		{errors}
		optional
	/>
</fieldset>
