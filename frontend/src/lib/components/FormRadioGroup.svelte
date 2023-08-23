<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
	export let errors: any;
	export let options: any[];
	export let valueField = '';
	export let textField = '';

	const values =
		valueField && textField
			? options.map((item) => [item[valueField], item[textField]])
			: options.map((item) => [item, item]);
</script>

<div>
	<label class="label radio-group-label" for={id}>{label}</label>
	<div
		{id}
		class="flex flex-col space-y-2"
		aria-invalid={errors[name] ? 'true' : undefined}
		on:change={() => (errors[name] = false)}
	>
		{#each values as [value, text]}
			<label class="flex items-center space-x-2">
				<input {name} {value} type="radio" class="radio" bind:group={form[name]} required />
				<p>{text}</p>
			</label>
		{/each}
	</div>
	{#if errors[name]}
		<small class="error-message">{errors[name]}</small>
	{/if}
</div>

<style>
	label.radio-group-label {
		margin-bottom: 0.5rem;
	}
</style>
