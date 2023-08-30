<script lang="ts">
	import FormTextArea from '$lib/components/FormTextArea.svelte';
	export let form: any;
	export let errors: any;
	export let placeholder = '';
	export let showLabel = true;
</script>

<FormTextArea
	id="comments-area"
	name="comments"
	label={showLabel ? 'Comments' : ''}
	{form}
	{errors}
	{placeholder}
	maxlength={1000}
	optional
/>
