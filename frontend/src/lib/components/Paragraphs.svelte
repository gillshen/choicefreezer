<script lang="ts">
	export let paragraphs: string;
	export let gap = 1;
</script>

<div class={`flex flex-col gap-${gap} max-w-prose`}>
	{#each paragraphs.split(/(\r?\n)+/g) as paragraph}
		<p class="leading-normal">{paragraph}</p>
	{/each}
</div>
