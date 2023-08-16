<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
	export let errors: any;
	export let optional: boolean = false;
	export let rows = 5;
	export let placeholder = '';

	const labelClassName = optional ? 'label optional' : 'label required';
</script>

<div>
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
	/>
	{#if errors[name]}
		<div class="error-message">{errors[name]}</div>
	{/if}
</div>
