<script lang="ts">
	import FormRadioGroup from '$lib/components/FormRadioGroup.svelte';
	import { Gender } from '$lib/constants/genders';

	export let form: any;
	export let errors: any;
</script>

<FormRadioGroup
	id="gender-radio-group"
	name="gender"
	label="Gender"
	options={Object.values(Gender)}
	{form}
	{errors}
/>
