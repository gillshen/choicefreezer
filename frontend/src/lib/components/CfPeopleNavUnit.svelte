<script lang="ts">
	import type { UserListItem } from '$lib/types/userTypes';

	export let cfPeople: UserListItem[];
	export let classNames = '';

	const usernames = cfPeople.map((cp) => cp.username).sort();
</script>

<ul class={`grid grid-cols-2 ${classNames}`}>
	{#each usernames as username}
		<li><a data-sveltekit-reload href={`../cf/${username}/`}>{username}</a></li>
	{/each}
</ul>
