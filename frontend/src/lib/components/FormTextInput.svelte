<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
	export let errors: any;
	export let optional = false;
	export let maxlength = 1000;
	export let showCharCount = false;
	export let optionalText = 'optional';
	export let width: undefined | 'wider' = undefined;
</script>

<div class="flex flex-col">
	<label class="label" for={id}>
		{label}
		{#if optional}<span class="optional">({optionalText})</span>{/if}
	</label>
	<input
		{id}
		{name}
		type="text"
		class={`input ${width ? width : ''}`}
		bind:value={form[name]}
		aria-invalid={errors[name] ? 'true' : undefined}
		required={!optional}
		{maxlength}
		on:input={() => (errors[name] = false)}
	/>
	{#if showCharCount}
		<small class="char-count">{form[name].length}/{maxlength}</small>
	{/if}
	{#if errors[name]}
		<small class="error-message">{errors[name]}</small>
	{/if}
</div>
