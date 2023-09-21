<script lang="ts">
	import { goto } from '$app/navigation';
	import { deleteEnrollment } from '$lib/api.js';
	import BinaryDialog from '$lib/components/BinaryDialog.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import Section from '$lib/components/Section.svelte';
	import { UNKNOWN_ERROR } from '$lib/constants/messages.js';
	import EnrollmentForm from '$lib/forms/EnrollmentForm.svelte';
	import { toMonthYear } from '$lib/utils/dateUtils.js';
	import { toast } from '$lib/utils/interactiveUtils.js';

	export let data;

	let userIsOwner = true;
	let enrollmentUpdateDialog: HTMLDialogElement;
	let enrollmentDeleteDialog: HTMLDialogElement;

	// TODO move to server side?
	async function handleDeleteEnrollment() {
		const response = await deleteEnrollment(enrollment.id);
		if (response.ok) {
			enrollmentDeleteDialog.close();
			toast('Attendance record deleted. Redirecting...', 'success');
			setTimeout(() => goto(`/students/${enrollment.student.id}/`), 2000);
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	$: enrollment = data.enrollment;
</script>

<Section hero>
	<h1 class="cf-h1">{enrollment.student.name} @ {enrollment.school.name}</h1>

	<div class="grid grid-cols-3 gap-12 h-full max-h-[960px]">
		<article class="panel">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="flex gap-2 items-baseline pb-2">
					<span class="text-xl font-bold">
						{enrollment.student.name}
					</span>
					<a href={`/students/${enrollment.student.id}`} class="cf-page-link text-base">
						<i class="fa-solid fa-arrow-right" />
					</a>
				</div>

				<div class="flex gap-2 items-baseline pb-4">
					<span>
						{enrollment.school.name}
					</span>
					<a href={`/schools/${enrollment.school.id}`} class="cf-page-link text-base">
						<i class="fa-solid fa-arrow-right" />
					</a>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label mb-1">From</div>
					<div>
						{toMonthYear(enrollment.start_date)}
						({enrollment.starting_progression})
					</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label mb-1">To</div>
					<div>
						{#if enrollment.end_date && enrollment.ending_progression}
							{toMonthYear(enrollment.end_date)}
							({enrollment.ending_progression})
						{:else if enrollment.end_date && !enrollment.ending_progression}
							{toMonthYear(enrollment.end_date)}
						{:else if !enrollment.end_date && enrollment.ending_progression}
							? ({enrollment.ending_progression})
						{:else}
							n/a
						{/if}
					</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label mb-1">
						{enrollment.program_type === 'Pre-College' ? 'Curriculum' : 'Majors'}
					</div>
					<div>
						{(enrollment.program_type === 'Pre-College'
							? enrollment.curriculum
							: enrollment.majors) || 'n/a'}
					</div>
				</div>

				{#if userIsOwner}
					<footer class="flex gap-6 mt-auto pt-4">
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-primary-400 hover:text-primary-500"
							on:click={() => enrollmentUpdateDialog.showModal()}>Edit</button
						>
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-error-400 hover:text-error-500"
							on:click={() => enrollmentDeleteDialog.showModal()}>Delete</button
						>
					</footer>
				{/if}
			</div>
		</article>

		<article class="panel">GPA</article>

		<article class="panel">Class rank</article>
	</div>
</Section>

<Dialog bind:dialog={enrollmentUpdateDialog} exitHelper>
	<EnrollmentForm
		bind:dialog={enrollmentUpdateDialog}
		action="?/updateEnrollment"
		studentId={enrollment.student.id}
		enrollment={{ ...enrollment, student: enrollment.student.id, school: enrollment.school.id }}
		data={data.enrollmentForm}
		schools={data.schools}
	/>
</Dialog>

<BinaryDialog
	title="Delete this attendance record?"
	bind:dialog={enrollmentDeleteDialog}
	onYes={handleDeleteEnrollment}
	dangerous
>
	<p class="text-surface-200">
		Deleting the attendance record will also delete the associated GPA and class ranking data. Are
		you sure you want to proceed?
	</p>
</BinaryDialog>
