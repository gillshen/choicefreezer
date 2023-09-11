<script lang="ts">
	export let id: string;
	export let name: string;
	export let label: string;
	export let form: any;
</script>

<div class="flex flex-row gap-4 items-start mt-2">
	<input {id} {name} type="checkbox" class="checkbox" bind:checked={form[name]} />
	<label class="label !pt-0 !-mt-0.5 max-w-md" for={id}>{label}</label>
</div>
