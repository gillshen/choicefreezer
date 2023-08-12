<script lang="ts">
	export let data;
	const { students } = data;
</script>

<h1 class="h1">Students</h1>

<pre class="text-surface-400">{JSON.stringify(students, null, 2)}</pre>
