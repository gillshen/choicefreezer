<script lang="ts">
	export let data;
	const { schools } = data;
</script>

<div class="grid-page-container">
	<div class="grid-page-sidebar">
		<div class="grid-page-sidebar-content">
			<pre>{JSON.stringify(schools, null, 2)}</pre>
		</div>
	</div>

	<div class="grid-page-content">
		<h1 class="grid-page-title">Schools</h1>
	</div>
</div>
