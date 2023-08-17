<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { StudentCitizenshipSchema } from '$lib/schemas';
	import StudentFormWrapper from './StudentFormWrapper.svelte';
	import StudentCitizenshipField from '$lib/components/StudentCitizenshipField.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<StudentCitizenshipSchema>;
</script>

<StudentFormWrapper fields={StudentCitizenshipField} {dialog} {action} {studentId} {data} />
