<script lang="ts">
	export let data;
	const { applications } = data;
</script>

<h1 class="h1">Applications</h1>

<pre class="text-surface-400">{JSON.stringify(applications, null, 2)}</pre>
