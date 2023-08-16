<script lang="ts">
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	export let form: any;
	export let errors: any;
</script>

<div class="hidden">
	<FormTextInput id="id-input" name="id" label="ID" {form} {errors} />
</div>
