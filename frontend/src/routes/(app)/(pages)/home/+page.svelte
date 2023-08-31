<script lang="ts">
	import UserPage from '$lib/components/UserPage.svelte';
	import type { ApplicationListItem } from '$lib/types/applicationTypes';
	import type { User } from '$lib/types/userTypes';

	export let data: { username: string; owner: User; applications: ApplicationListItem[] };
</script>

<UserPage {data} />
