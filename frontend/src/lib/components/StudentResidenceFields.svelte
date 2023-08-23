<script lang="ts">
	import FormSelect from '$lib/components/FormSelect.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import OptionList from './OptionList.svelte';
	import { US_STATES } from '$lib/constants/usStates';

	export let form: any;
	export let errors: any;
</script>

<FormTextInput id="city-input" name="city" label="City" {form} {errors} optional />

<FormSelect id="state-select" name="state" label="US State" {form} {errors} optional>
	<OptionList options={US_STATES} insertEmptyRow />
</FormSelect>
