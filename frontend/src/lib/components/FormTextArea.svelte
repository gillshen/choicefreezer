<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
	export let errors: any;
	export let optional: boolean = false;
	export let rows = 5;
	export let placeholder = '';
	export let maxlength = 5000;
	export let showCharCount = true;

	const labelClassName = optional ? 'label optional' : 'label required';
</script>

<div class="flex flex-col">
	<label class={labelClassName} for={id}>{label}</label>
	<textarea
		{id}
		{name}
		class="input"
		bind:value={form[name]}
		aria-invalid={errors[name] ? 'true' : undefined}
		required={!optional}
		{placeholder}
		{rows}
		{maxlength}
	/>
	{#if showCharCount}
		<small class="char-count">{form[name].length}/{maxlength}</small>
	{/if}
	{#if errors[name]}
		<small class="error-message">{errors[name]}</small>
	{/if}
</div>
