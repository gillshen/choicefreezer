<script lang="ts">
	import type { UserListItem } from '$lib/types/userTypes';
	import {
		filterForEssayAdvisors,
		filterForPlannersExcludingEssayAdvisors
	} from '$lib/utils/userUtils';
	import CfPeopleNavUnit from './CfPeopleNavUnit.svelte';

	export let cfPeople: UserListItem[];

	const planners = filterForPlannersExcludingEssayAdvisors(cfPeople);
	const essayAdvisors = filterForEssayAdvisors(cfPeople);
</script>

<div class="grid grid-cols-[auto_auto_auto] gap-8">
	<CfPeopleNavUnit cfPeople={planners} />
	<div class="divider h-full w-[1px]" />
	<CfPeopleNavUnit cfPeople={essayAdvisors} />
</div>
