<script lang="ts">
	import { goto } from '$app/navigation';
	import { deleteEnrollment } from '$lib/api.js';
	import Section from '$lib/components/Section.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import BinaryDialog from '$lib/components/BinaryDialog.svelte';
	import GpaCard from '$lib/components/GpaCard.svelte';
	import ClassRankCard from '$lib/components/ClassRankCard.svelte';
	import EnrollmentForm from '$lib/forms/EnrollmentForm.svelte';
	import GpaForm from '$lib/forms/GpaForm.svelte';
	import ClassRankForm from '$lib/forms/ClassRankForm.svelte';
	import { formatProgression, groupByProgressionDesc } from '$lib/utils/enrollmentUtils.js';
	import { byTermDescCumulativeFirst } from '$lib/utils/sortUtils.js';
	import { toMonthYear } from '$lib/utils/dateUtils.js';
	import { toast } from '$lib/utils/interactiveUtils.js';
	import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

	export let data;

	// TODO
	let userIsOwner = true;

	let enrollmentUpdateDialog: HTMLDialogElement;
	let enrollmentDeleteDialog: HTMLDialogElement;
	let gpaCreateDialog: HTMLDialogElement;
	let rankCreateDialog: HTMLDialogElement;

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
	$: gpasGrouped = Object.entries(groupByProgressionDesc(enrollment.grades));
	$: classRanksGrouped = Object.entries(groupByProgressionDesc(enrollment.class_ranks));
</script>

<Section hero>
	<h1 class="cf-h1">{enrollment.student.name} @ {enrollment.school.name}</h1>

	<div class="grid grid-cols-3 gap-12 h-full items-start">
		<article class="panel">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="mb-4">
					<a href={`/students/${enrollment.student.id}`} class="link-card">
						<div class="font-bold">{enrollment.student.name}</div>
						<i class="fa-solid fa-arrow-right" />
					</a>
				</div>

				<div class="mb-2">
					<a href={`/students/${enrollment.school.id}`} class="link-card">
						<div class="font-bold">{enrollment.school.name}</div>
						<i class="fa-solid fa-arrow-right" />
					</a>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label mb-1">From</div>
					<div>
						{toMonthYear(enrollment.start_date)}
						({formatProgression(enrollment.starting_progression)})
					</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label mb-1">To</div>
					<div>
						{#if enrollment.end_date && enrollment.ending_progression}
							{toMonthYear(enrollment.end_date)}
							({formatProgression(enrollment.ending_progression)})
						{:else if enrollment.end_date && !enrollment.ending_progression}
							{toMonthYear(enrollment.end_date)}
						{:else if !enrollment.end_date && enrollment.ending_progression}
							? ({formatProgression(enrollment.ending_progression)})
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

		<article class="panel fit-height">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<h2 class="font-heading-token">GPAs</h2>

				{#if gpasGrouped.length}
					<div class="flex flex-col gap-3 mt-3">
						{#each gpasGrouped as [progression, gpaArray]}
							<div class="flex flex-col">
								<div class="cf-entry-label mb-1">
									{formatProgression(progression)}
								</div>
								<div class="flex flex-col">
									{#each gpaArray.sort(byTermDescCumulativeFirst) as gpa}
										<GpaCard {gpa} {userIsOwner} />
									{/each}
								</div>
							</div>
						{/each}
					</div>

					{#if userIsOwner}
						<footer class="flex gap-6 mt-auto pt-4">
							<button
								class="cf-btn flex gap-2 items-center pb-8 pt-4 text-primary-400 hover:text-primary-500"
								on:click={() => gpaCreateDialog.showModal()}>Add another</button
							>
						</footer>
					{/if}
				{:else if userIsOwner}
					<button
						class="btn cf-btn cf-primary !bg-primary-500 max-w-fit mt-4 mb-6"
						on:click={() => gpaCreateDialog.showModal()}>Add a GPA record</button
					>
				{/if}
			</div>
		</article>

		<article class="panel fit-height">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<h2 class="font-heading-token">Class ranks</h2>

				{#if classRanksGrouped.length}
					<div class="flex flex-col gap-3 mt-3">
						{#each classRanksGrouped as [progression, classRankArray]}
							<div class="flex flex-col">
								<div class="cf-entry-label mb-1">
									{formatProgression(progression)}
								</div>
								<div class="flex flex-col">
									{#each classRankArray.sort(byTermDescCumulativeFirst) as classRank}
										<ClassRankCard rank={classRank} {userIsOwner} />
									{/each}
								</div>
							</div>
						{/each}
					</div>

					{#if userIsOwner}
						<footer class="flex gap-6 mt-auto pt-4">
							<button
								class="cf-btn flex gap-2 items-center pb-8 pt-4 text-primary-400 hover:text-primary-500"
								on:click={() => rankCreateDialog.showModal()}>Add another</button
							>
						</footer>
					{/if}
				{:else if userIsOwner}
					<button
						class="btn cf-btn cf-primary !bg-primary-500 max-w-fit mt-4 mb-6"
						on:click={() => rankCreateDialog.showModal()}>Add a class rank</button
					>
				{/if}
			</div>
		</article>
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

<Dialog bind:dialog={gpaCreateDialog} exitHelper title="Add a GPA record">
	<GpaForm
		bind:dialog={gpaCreateDialog}
		data={data.gpaCreateForm}
		action="?/createGpa"
		enrollmentId={enrollment.id}
		programType={enrollment.program_type}
	/>
</Dialog>

<Dialog bind:dialog={rankCreateDialog} exitHelper title="Add a class rank">
	<ClassRankForm
		bind:dialog={rankCreateDialog}
		data={data.classRankCreateForm}
		action="?/createClassRank"
		enrollmentId={enrollment.id}
		programType={enrollment.program_type}
	/>
</Dialog>
