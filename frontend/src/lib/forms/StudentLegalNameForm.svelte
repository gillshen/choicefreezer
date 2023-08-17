<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { StudentLegalNameSchema } from '$lib/schemas';
	import StudentFormWrapper from './StudentFormWrapper.svelte';
	import StudentLegalNameFields from '$lib/components/StudentLegalNameFields.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<StudentLegalNameSchema>;
</script>

<StudentFormWrapper fields={StudentLegalNameFields} {dialog} {action} {studentId} {data} />
