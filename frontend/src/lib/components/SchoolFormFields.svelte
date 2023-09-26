<script lang="ts">
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormTextInput from './FormTextInput.svelte';
	import OptionList from './OptionList.svelte';
	import FormRadioGroup from './FormRadioGroup.svelte';
	import { COUNTRIES } from '$lib/constants/countries';
	import { SCHOOL_TYPES } from '$lib/constants/schoolTypes';
	import { byNameChinaFirst } from '$lib/utils/sortUtils';

	export let form: any;
	export let errors: any;
</script>

<fieldset>
	<legend class="empty" />

	<FormSelect id="country-select" name="country" label="Home country" {form} {errors}>
		<OptionList options={COUNTRIES.sort(byNameChinaFirst)} />
	</FormSelect>

	<FormRadioGroup
		id="type-select"
		name="type"
		label="Type"
		options={Array.from(SCHOOL_TYPES)}
		{form}
		{errors}
	/>
</fieldset>

<fieldset>
	<FormTextInput id="name-input" name="name" label="Full name" {form} {errors} width="wider" />

	<FormTextInput
		id="abbreviation-input"
		name="abbreviation"
		label="Abbreviation"
		{form}
		{errors}
		optional
		width="narrower"
	/>
</fieldset>
