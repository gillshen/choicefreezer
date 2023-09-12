<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import Section from '$lib/components/Section.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import SchoolFormFields from '$lib/components/SchoolFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils.js';

	import type { DomLayoutType } from 'ag-grid-community';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';
	import {
		ApplicationIdRenderer,
		ApplicantRenderer,
		ProgramRenderer,
		TargetRenderer,
		StatusRenderer,
		targetValueGetter,
		majorsValueGetter
	} from '$lib/utils/applicationGridUtils.js';

	import { NO_ROWS_TO_SHOW } from '$lib/constants/messages.js';

	export let data;

	let schoolUpdateDialog: HTMLDialogElement;

	const { form, errors, message, enhance } = superForm(data.form, {
		id: 'updateSchool',
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, schoolUpdateDialog!)
	});

	const applicationColumnDefs = [
		{
			headerName: 'Link',
			field: 'id',
			flex: 0,
			maxWidth: 80,
			filter: false,
			sortable: false,
			minWidth: 50,
			cellRenderer: ApplicationIdRenderer
		},
		{ headerName: 'Student', field: 'student.name', cellRenderer: ApplicantRenderer },
		{ headerName: 'Target', valueGetter: targetValueGetter, cellRenderer: TargetRenderer },
		{ headerName: 'Program', field: 'program.display_name', cellRenderer: ProgramRenderer },
		{ headerName: 'Major', valueGetter: majorsValueGetter },
		{ headerName: 'Admission Plan', field: 'subtarget.admission_plan' },
		{ headerName: 'Status', field: 'latest_log.status', cellRenderer: StatusRenderer }
	];

	const gridOptions = {
		defaultColDef,
		columnTypes,
		columnDefs: applicationColumnDefs,
		rowData: data.applications,
		suppressDragLeaveHidesColumns: true,
		domLayout: data.applications.length > 15 ? undefined : ('autoHeight' as DomLayoutType)
	};

	$: school = data.school;

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<Section hero>
	<h1 class="cf-h1">{school.name}</h1>

	<pre class="text-surface-400">{JSON.stringify(school, null, 2)}</pre>
	<button class="btn cf-btn cf-secondary" on:click={() => schoolUpdateDialog.showModal()}
		>Edit</button
	>
</Section>

<Section>
	<h2 class="text-xl font-heading-token font-bold mb-8">Applications</h2>

	{#if data.applications.length}
		<div class={`w-full ${data.applications.length > 15 ? 'h-[calc(100vh-12rem)]' : ''}`}>
			<div id="applications-grid" class="data-grid ag-theme-alpine-dark" />
		</div>
	{:else}
		<p class="section-placeholder">{NO_ROWS_TO_SHOW}</p>
	{/if}
</Section>

<Dialog exitHelper bind:dialog={schoolUpdateDialog}>
	<form method="post" action="?/updateSchool" novalidate use:enhance>
		<HiddenIdField id="school-id" name="id" value={school.id} />
		<SchoolFormFields form={$form} errors={$errors} />
		<FormSubmit message={$message} />
	</form>
</Dialog>
