<script lang="ts">
	export let data;
	const { schools } = data;
</script>

<h1 class="max-w-6xl px-8">Schools</h1>

{#if schools.length}
	<pre class="text-surface-400">{JSON.stringify(schools, null, 2)}</pre>
{/if}
