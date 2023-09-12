<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
	export let errors: any;
	export let optional = false;
	export let optionalText = 'optional';
</script>

<div class="flex flex-col">
	<label class="label" for={id}>
		{label}
		{#if optional}<span class="optional">({optionalText})</span>{/if}
	</label>
	<input
		{id}
		{name}
		type="date"
		class="input"
		bind:value={form[name]}
		aria-invalid={errors[name] ? 'true' : undefined}
		required={!optional}
	/>
	{#if errors[name]}
		<small class="error-message">
			{#each errors[name] as error}
				<p>{error}</p>
			{/each}
		</small>
	{/if}
</div>
