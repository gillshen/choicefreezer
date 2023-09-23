<script lang="ts">
	export let paragraphs: string;
	export let gap = 1;
	export let textClass = '';
</script>

<div class={`flex flex-col gap-${gap} max-w-prose`}>
	{#each paragraphs.split(/(\r?\n){2,}/g) as paragraph}
		<p class={`leading-normal ${textClass}`}>
			{#each paragraph.split(/\r?\n/g) as subparagraph, index}
				{#if index}<br />{/if}
				{subparagraph}
			{/each}
		</p>
	{/each}
</div>
