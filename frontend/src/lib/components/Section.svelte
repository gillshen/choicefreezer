<script lang="ts">
	export let classNames = '';
	export let hero = false;
	export let wide = false;
	export let long = false;
</script>

<div class={`page-section-container ${hero ? 'hero' : ''} ${long ? 'long' : ''}`}>
	<div class={`${wide ? '' : 'page-section'} ${classNames}`}>
		<slot />
	</div>
</div>
