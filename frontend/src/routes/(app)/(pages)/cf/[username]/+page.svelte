<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';

	import type { User } from '$lib/types/userTypes';
	import type { UserLog } from '$lib/types/userLogTypes';
	import type { NewUserLogSchema } from '$lib/schemas';
	import type { ApplicationListItem } from '$lib/types/applicationTypes';

	import UserPage from '$lib/components/UserPage.svelte';

	export let data: {
		userId: number;
		username: string;
		owner: User;
		logs: UserLog[];
		userLogForm: SuperValidated<NewUserLogSchema>;
		applications: ApplicationListItem[];
	};
</script>

<UserPage {data} />
