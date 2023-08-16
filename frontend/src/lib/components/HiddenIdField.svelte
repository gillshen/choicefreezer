<script lang="ts">
	export let value: number;
	export let name = 'id';
	export let id = 'hidden-id';
</script>

<div class="hidden">
	<label>
		<input {id} type="text" class="input" {name} {value} />
	</label>
</div>
