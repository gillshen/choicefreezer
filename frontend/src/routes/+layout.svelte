<script>
	// Skeleton theme:
	// import '@skeletonlabs/skeleton/themes/theme-skeleton.css';

	// Custom theme generated at https://www.skeleton.dev/docs/generator
	import '../app-theme.css';

	// Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/skeleton.css';

	// This application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';

	// Use floating UI for popups: https://www.skeleton.dev/utilities/popups
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<slot />
