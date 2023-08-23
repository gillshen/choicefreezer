<script lang="ts">
	import FormDateInput from '$lib/components/FormDateInput.svelte';

	export let form: any;
	export let errors: any;
</script>

<FormDateInput id="dob-input" name="date_of_birth" label="Date of birth" {form} {errors} optional />
