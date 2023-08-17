<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { StudentCommentsSchema } from '$lib/schemas';
	import StudentFormWrapper from './StudentFormWrapper.svelte';
	import StudentCommentsField from '$lib/components/StudentCommentsField.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<StudentCommentsSchema>;
</script>

<StudentFormWrapper fields={StudentCommentsField} {dialog} {action} {studentId} {data} />
