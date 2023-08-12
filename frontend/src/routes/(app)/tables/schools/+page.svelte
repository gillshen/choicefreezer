<script lang="ts">
	export let data;
	const { schools } = data;
</script>

<h1 class="h1">Schools</h1>

<pre class="text-surface-400">{JSON.stringify(schools, null, 2)}</pre>
