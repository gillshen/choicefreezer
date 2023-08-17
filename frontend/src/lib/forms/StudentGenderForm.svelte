<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { StudentGenderSchema } from '$lib/schemas';
	import StudentFormWrapper from './StudentFormWrapper.svelte';
	import StudentGenderField from '$lib/components/StudentGenderField.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<StudentGenderSchema>;
</script>

<StudentFormWrapper fields={StudentGenderField} {dialog} {action} {studentId} {data} />
