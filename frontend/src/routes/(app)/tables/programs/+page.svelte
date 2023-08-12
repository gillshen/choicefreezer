<script lang="ts">
	export let data;
	const { programs } = data;
</script>

<h1 class="h1">Programs</h1>

<pre class="text-surface-400">{JSON.stringify(programs, null, 2)}</pre>
