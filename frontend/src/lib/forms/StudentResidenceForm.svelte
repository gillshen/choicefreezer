<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { StudentResidenceSchema } from '$lib/schemas';
	import StudentFormWrapper from './StudentFormWrapper.svelte';
	import StudentResidenceFields from '$lib/components/StudentResidenceFields.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<StudentResidenceSchema>;
</script>

<StudentFormWrapper fields={StudentResidenceFields} {dialog} {action} {studentId} {data} />
