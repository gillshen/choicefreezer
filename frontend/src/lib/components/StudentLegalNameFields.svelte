<script lang="ts">
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';

	export let form: any;
	export let errors: any;
</script>

<FormTextInput
	id="last-name-input"
	name="last_name"
	label="Last name"
	{form}
	{errors}
	maxlength={50}
/>

<FormTextInput
	id="first-name-input"
	name="first_name"
	label="First name"
	{form}
	{errors}
	maxlength={50}
/>

<div class="col-span-2">
	<FormCheckInput id="chinese-name-check" name="last_name_first" label="Last name first" {form} />
</div>
