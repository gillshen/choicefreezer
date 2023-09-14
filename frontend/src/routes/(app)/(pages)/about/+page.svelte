<script>
	import Section from '$lib/components/Section.svelte';
</script>

<Section hero>
	<div
		class="flex flex-col justify-center items-center h-[55vh] w-full text-4xl font-heading-token font-bold"
	>
		<p>
			Less <a href="https://www.instagram.com/excelhumor.xlsx/" class="excel">Excel</a>, More
			<span class="text-primary-500">Sanity</span>
		</p>
	</div>
</Section>

<style lang="postcss">
	.excel {
		transition: all 2s ease-in-out;
	}
	.excel:hover {
		filter: blur(8px);
	}
</style>
