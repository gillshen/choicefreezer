<script lang="ts">
	import type { StudentOfUser } from '$lib/types/userTypes';
	import { typeToClass, typeToInitial } from '$lib/utils/contractUtils';

	export let student: StudentOfUser | null = null;
</script>

{#if student}
	<a href={`../students/${student.id}/`} class="student-anchor card">
		<header class={`contract-chip bg-${typeToClass(student.latest_contract_type)}`}>
			<p>{typeToInitial(student.latest_contract_type)}</p>
		</header>
		<section>{student.name}</section>
	</a>
{:else}
	<a href="../students/new/" class="student-anchor card">
		<div class="flex-grow flex justify-center items-center bg-primary-500 text-surface-900">
			Add a student
		</div>
	</a>
{/if}

<style lang="postcss">
	.student-anchor,
	.student-anchor div {
		@apply w-[9rem] h-[9rem] max-w-[9rem];
		@apply flex flex-col;
		@apply rounded-2xl;
	}
	/* globally: cf-card-shadow */
	.student-anchor {
		box-shadow: 10px 10px 24px rgb(25, 25, 25), -8px -8px 20px rgb(55, 55, 55);
	}
	.student-anchor:hover {
		box-shadow: 12px 12px 24px rgb(25, 25, 25), -10px -10px 20px rgb(55, 55, 55);
	}
	.student-anchor section {
		@apply text-lg;
		@apply max-w-full overflow-hidden text-ellipsis;
		@apply p-6;
	}
	header.contract-chip {
		@apply p-0 mx-6 mt-4;
		@apply rounded-full;
		@apply w-6 h-6;
		@apply flex items-center justify-center;
		@apply text-sm text-surface-900 font-bold text-center;
	}
</style>
