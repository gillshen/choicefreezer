<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { StudentDateOfBirthSchema } from '$lib/schemas';
	import StudentFormWrapper from './StudentFormWrapper.svelte';
	import StudentDobField from '$lib/components/StudentDobField.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<StudentDateOfBirthSchema>;
</script>

<StudentFormWrapper fields={StudentDobField} {dialog} {action} {studentId} {data} />
