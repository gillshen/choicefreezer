<script lang="ts">
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';
	import FormDateInput from '$lib/components/FormDateInput.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormRadioGroup from '$lib/components/FormRadioGroup.svelte';
	import OptionList from './OptionList.svelte';

	import { Gender } from '$lib/constants/genders';
	import { COUNTRIES } from '$lib/constants/countries';
	import { US_STATES } from '$lib/constants/usStates';
	import { sortCountries } from '$lib/utils/sortUtils';

	export let form: any;
	export let errors: any;
</script>

<fieldset>
	<legend>Legal name</legend>

	<FormTextInput id="last-name-input" name="last_name" label="Last name" {form} {errors} />
	<FormTextInput id="first-name-input" name="first_name" label="First name" {form} {errors} />

	<FormCheckInput
		id="chinese-name-check"
		name="name_in_chinese"
		label="This is a Chinese name"
		{form}
	/>
</fieldset>

<fieldset>
	<legend>Name in English or Pinyin</legend>

	<!-- TODO a checkbox to indicate the English name is identical to the legal name -->
	<FormTextInput
		id="last-name-romanized-input"
		name="last_name_romanized"
		label="Last name"
		{form}
		{errors}
	/>

	<FormTextInput
		id="first-name-romanized-input"
		name="first_name_romanized"
		label="First or preferred name"
		{form}
		{errors}
	/>
</fieldset>

<fieldset>
	<legend>Personal information</legend>

	<FormRadioGroup
		id="gender-radio-group"
		name="gender"
		label="Gender"
		options={Object.values(Gender)}
		{form}
		{errors}
	/>

	<FormSelect id="citizenship-select" name="citizenship" label="Citizenship" {form} {errors}>
		<OptionList options={COUNTRIES.sort(sortCountries)} />
	</FormSelect>

	<FormDateInput id="dob-input" name="date_of_birth" label="Date of birth" {form} {errors} />
</fieldset>

<fieldset>
	<legend>Residence</legend>

	<FormTextInput id="city-input" name="city" label="City" {form} {errors} />

	<FormSelect id="state-select" name="state" label="US State" {form} {errors}>
		<OptionList options={US_STATES} insertEmptyRow />
	</FormSelect>
</fieldset>
