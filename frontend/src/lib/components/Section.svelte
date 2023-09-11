<script lang="ts">
	export let classNames = '';
	export let wide = false;
	export let hero = false;
	export let long = false;
	export let lighter = false;

	const containerClass = `${hero ? 'hero' : ''} ${long ? 'long' : ''} ${lighter ? 'lighter' : ''}`;
</script>

<div class={`page-section-container ${containerClass}`}>
	<div class={`${wide ? '' : 'page-section'} ${classNames}`}>
		<slot />
	</div>
</div>
