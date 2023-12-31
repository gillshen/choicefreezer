<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import Section from '$lib/components/Section.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import { closeDialogOnSuccess } from '$lib/utils/formUtils.js';

	import type { DomLayoutType } from 'ag-grid-community';
	import { defaultColDef, columnTypes, mountGrid } from '$lib/utils/gridUtils.js';
	import {
		ApplicationIdRenderer,
		ApplicantRenderer,
		TargetRenderer,
		StatusRenderer,
		targetValueGetter,
		majorsValueGetter,
		deadlineValueGetter,
		deadlineValueFormatter
	} from '$lib/utils/applicationGridUtils.js';
	import { NONE_AT_THE_MOMENT } from '$lib/constants/messages.js';

	export let data;

	let programUpdateDialog: HTMLDialogElement;

	const { form, errors, message, enhance } = superForm(data.programUpdateForm, {
		id: 'updateProgram',
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => closeDialogOnSuccess(result, programUpdateDialog!)
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
		{ headerName: 'Major', valueGetter: majorsValueGetter },
		{ headerName: 'Admission Plan', field: 'subtarget.admission_plan' },
		{
			headerName: 'Deadline',
			type: ['dateStringColumn'],
			valueGetter: deadlineValueGetter,
			valueFormatter: deadlineValueFormatter
		},
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

	$: program = data.program;

	onMount(() => mountGrid('#applications-grid', gridOptions));
</script>

<Section hero>
	<h1 class="cf-h1">Program {program.id}</h1>

	<pre class="text-surface-400">{JSON.stringify(program, null, 2)}</pre>

	<button class="btn cf-btn cf-secondary" on:click={() => programUpdateDialog.showModal()}
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
		<p class="section-placeholder">{NONE_AT_THE_MOMENT}</p>
	{/if}
</Section>

<Dialog exitHelper bind:dialog={programUpdateDialog}>
	<form method="post" action="?/updateProgram" novalidate use:enhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField id="program-id" value={program.id} />

			<FormTextInput
				id="program-name-input"
				name="name"
				label="Name"
				form={$form}
				errors={$errors}
				width="wider"
			/>

			<FormTextInput
				id="program-degree-input"
				name="degree"
				label="Degree"
				form={$form}
				errors={$errors}
				width="wider"
			/>
		</fieldset>

		<FormSubmit message={$message} />
	</form>
</Dialog>
