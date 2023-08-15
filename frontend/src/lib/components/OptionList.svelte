<script lang="ts">
	export let options: any[];
	export let valueField = '';
	export let textField = '';
	export let insertEmptyRow = false;
	export let insertNullRow = false;

	const values =
		valueField && textField
			? options.map((item) => [item[valueField], item[textField]])
			: options.map((item) => [item, item]);
</script>

{#if insertEmptyRow}
	<option value="" />
{/if}

{#if insertNullRow}
	<option value={null} />
{/if}

{#each values as [value, text]}
	<option {value}>{text}</option>
{/each}
