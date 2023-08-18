<script lang="ts">
	export let data;
	const { programs } = data;
</script>

<h1 class="max-w-6xl px-8">Programs</h1>

<div class="h-full max-w-6xl mx-auto p-8 flex flex-col gap-8">
	{#if programs.length}
		<pre class="text-surface-400">{JSON.stringify(programs, null, 2)}</pre>
	{/if}
</div>
