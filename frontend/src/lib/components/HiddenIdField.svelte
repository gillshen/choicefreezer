<script lang="ts">
	export let value: number | string | null | undefined;
	export let name = 'id';
	export let id = 'hidden-id';
</script>

<div class="hidden p-0 m-0 min-h-0 h-0 overflow-hidden">
	<label>
		<input {id} type="text" class="input" {name} {value} />
	</label>
</div>
