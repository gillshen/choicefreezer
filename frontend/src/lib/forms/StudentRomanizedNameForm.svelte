<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { StudentRomanizedNameSchema } from '$lib/schemas';
	import StudentFormWrapper from '$lib/forms/StudentFormWrapper.svelte';
	import StudentRomanizedNameFields from '$lib/components/StudentRomanizedNameFields.svelte';

	export let dialog: HTMLDialogElement | undefined;
	export let action: string;
	export let studentId: number;
	export let data: SuperValidated<StudentRomanizedNameSchema>;
</script>

<StudentFormWrapper fields={StudentRomanizedNameFields} {dialog} {action} {studentId} {data} />
