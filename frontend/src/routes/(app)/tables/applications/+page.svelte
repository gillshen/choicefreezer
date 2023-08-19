<script lang="ts">
	export let data;
	const { applications } = data;
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<pre>{JSON.stringify(applications, null, 2)}</pre>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">Applications</h1>
	</div>
</div>
