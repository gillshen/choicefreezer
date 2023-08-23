<script lang="ts">
	import type { ApplicationStatus } from '$lib/types/applicationTypes';
	import { statusToClass } from '$lib/utils/applicationUtils';

	export let status: ApplicationStatus | null;
</script>

<div class={`app-status-chip ${statusToClass(status ?? '')}`}>
	{status ?? 'n/a'}
</div>
