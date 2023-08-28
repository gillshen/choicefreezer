<script lang="ts">
	export let value: number | null | undefined;
	export let name = 'id';
	export let id = 'hidden-id';
</script>

<div class="hidden h-0 overflow-hidden">
	<label>
		<input {id} type="text" class="input" {name} {value} />
	</label>
</div>
