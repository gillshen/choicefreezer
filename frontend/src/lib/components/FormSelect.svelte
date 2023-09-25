<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
	export let errors: any;
	export let optional = false;
	export let optionalText = 'optional';
	export let width: '' | 'wider' | 'narrower' = '';
	export let onChange: () => void = () => {};
</script>

<div class="flex flex-col">
	<label class={`label ${width}`} for={id}>
		{label}
		{#if optional}<span class="optional">({optionalText})</span>{/if}
	</label>
	<select
		{id}
		{name}
		class={`select ${width}`}
		bind:value={form[name]}
		aria-invalid={errors[name] ? 'true' : undefined}
		required={!optional}
		on:change={() => {
			errors[name] = false;
			onChange();
		}}
	>
		<slot />
	</select>
	{#if errors[name]}
		<small class="error-message">
			{#each errors[name] as error}
				<p>{error}</p>
			{/each}
		</small>
	{/if}
</div>
