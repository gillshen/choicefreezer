<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
	export let errors: any;
	export let optional: boolean = false;

	const labelClassName = optional ? 'label optional' : 'label required';
</script>

<div>
	<label class={labelClassName} for={id}>{label}</label>
	<select
		{id}
		{name}
		class="select"
		bind:value={form[name]}
		aria-invalid={errors[name] ? 'true' : undefined}
		required={!optional}
	>
		<slot />
	</select>
	{#if errors[name]}
		<div class="error-message">{errors[name]}</div>
	{/if}
</div>
