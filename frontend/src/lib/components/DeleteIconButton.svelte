<script lang="ts">
	import IconButton from './IconButton.svelte';

	export let size: 'sm' | 'md' | 'lg' = 'sm';
	export let classNames = '';
	export let onClick: any = null;
</script>

<IconButton {size} {onClick} {classNames}>
	<i class="fa-solid fa-trash-can" />
</IconButton>
