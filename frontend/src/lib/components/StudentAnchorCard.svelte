<script lang="ts">
	import type { StudentOfUser } from '$lib/types/userTypes';
	import type { ContractType } from '$lib/types/contractTypes';

	export let student: StudentOfUser | null = null;

	const chipClasses: Record<ContractType, string> = {
		'UG Freshman': 'ug-freshman',
		'UG Transfer': 'ug-transfer',
		Graduate: 'graduate'
	};
</script>

{#if student}
	<a href={`../students/${student.id}/`} class="student-anchor card">
		<header class={`contract-chip ${chipClasses[student.latest_contract_type]}`}>
			{student.latest_contract_type}
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
	.student-anchor.card,
	.student-anchor.card div {
		@apply w-[9rem] h-[9rem] max-w-[9rem];
		@apply flex flex-col;
		@apply card-hover rounded-2xl;
	}
	.student-anchor section {
		@apply text-lg;
		@apply max-w-full overflow-hidden text-ellipsis;
		@apply p-6;
	}
	.student-anchor:hover {
		@apply text-primary-500;
	}
	header.contract-chip {
		@apply px-6 py-2;
		@apply rounded-t-2xl;
		@apply text-sm text-surface-900;
	}
</style>
