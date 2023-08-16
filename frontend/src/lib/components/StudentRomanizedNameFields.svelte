<script lang="ts">
	import FormTextInput from '$lib/components/FormTextInput.svelte';

	export let form: any;
	export let errors: any;
</script>

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
