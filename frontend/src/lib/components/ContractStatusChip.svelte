<script lang="ts">
	import type { ContractStatus } from '$lib/types/contractTypes';
	import { statusToClass } from '$lib/utils/contractUtils';

	export let status: ContractStatus;
</script>

<div class={`contract-status-chip bg-${statusToClass(status)}`}>
	{status === 'Effective' ? 'In Effect' : status}
</div>
