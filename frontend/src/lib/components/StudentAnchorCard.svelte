<script lang="ts">
	import type { StudentOfUser } from '$lib/types/userTypes';
	import { typeToClass, typeToInitial } from '$lib/utils/contractUtils';

	export let student: StudentOfUser;
	export let lighter: boolean = false;

	$: shadowClass = lighter ? 'cf-card-shadow-convex-2' : 'cf-card-shadow-convex';
</script>

<a href={`../students/${student.id}/`} class={`student-anchor ${shadowClass}`}>
	<header class={`contract-chip bg-${typeToClass(student.latest_contract_type)}`}>
		<p>{typeToInitial(student.latest_contract_type)}</p>
	</header>
	<section>{student.name}</section>
</a>

<style lang="postcss">
	.student-anchor {
		@apply w-full h-[4rem];
		@apply flex gap-4 items-center;
		@apply rounded-full;
		@apply p-4;
		transition: all 0.3s ease-in-out;
	}
	.student-anchor:hover {
		@apply scale-[103%];
	}
	.student-anchor section {
		@apply max-w-full whitespace-nowrap overflow-hidden text-ellipsis;
	}
	header.contract-chip {
		@apply rounded-full h-full aspect-square;
		@apply flex items-center justify-center;
		@apply text-sm text-surface-900 font-bold text-center;
	}
</style>
