<script lang="ts">
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';

	export let form: any;
	export let errors: any;
</script>

<FormTextInput id="last-name-input" name="last_name" label="Last name" {form} {errors} />

<FormTextInput id="first-name-input" name="first_name" label="First name" {form} {errors} />

<FormCheckInput
	id="chinese-name-check"
	name="name_in_chinese"
	label="This is a Chinese name"
	{form}
/>
