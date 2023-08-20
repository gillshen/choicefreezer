<script lang="ts">
	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from './OptionList.svelte';
	import { COUNTRIES } from '$lib/constants/countries';
	import { byCountryName } from '$lib/utils/sortUtils';

	export let form: any;
	export let errors: any;
</script>

<FormSelect id="citizenship-select" name="citizenship" label="Citizenship" {form} {errors}>
	<OptionList options={COUNTRIES.sort(byCountryName)} />
</FormSelect>
