<script lang="ts">
	export let size: 'sm' | 'md' | 'lg' = 'sm';
	export let classNames = '';
	export let onClick: any = null;

	let sizeClass: string;
	switch (size) {
		case 'sm':
			sizeClass = 'scale-[80%]';
			break;
		case 'lg':
			sizeClass = 'scale-110';
			break;
		case 'md':
		default:
			sizeClass = '';
	}
</script>

<button
	on:click={onClick}
	class={`rounded-full aspect-square flex justify-center items-center p-[6px]  ${classNames}`}
>
	<div class={sizeClass}>
		<slot />
	</div>
</button>
