<script lang="ts">
	import { goto } from '$app/navigation';

	import PageSection from '$lib/components/PageSection.svelte';
	import ContractStatusChip from '$lib/components/ContractStatusChip.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import OkayCancelDialog from '$lib/components/OkayCancelDialog.svelte';
	import ContractUpdateForm from '$lib/forms/ContractUpdateForm.svelte';
	import { toast } from '$lib/utils/interactiveUtils.js';

	import { deleteContract } from '$lib/api.js';
	import { formatEndDate } from '$lib/utils/serviceUtils.js';
	import { byServiceRoleThenUsername } from '$lib/utils/sortUtils.js';
	import { UNKNOWN_ERROR } from '$lib/constants/messages.js';

	export let data;

	const userCanEdit = 1;

	let contractUpdateDialog: HTMLDialogElement;
	let contractDeleteDialog: HTMLDialogElement;

	// TODO move to server side?
	async function handleDeleteContract() {
		const response = await deleteContract(contract.id);
		if (response.ok) {
			contractDeleteDialog.close();
			toast('Contract deleted. Redirecting...', 'success');
			setTimeout(() => goto(`../students/${contract.student.id}/`), 3000);
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	$: contract = data.contract;
</script>

<h1>
	&copy; {contract.student.name} &bullet;
	{contract.type}
	{contract.target_year}

	<div class="mt-8">
		<ContractStatusChip status={contract.status} />
	</div>
</h1>

<PageSection>
	<div class="grid grid-cols-2 gap-x-12 gap-y-8 auto-rows-min items-start">
		<div class="px-0 py-6 rounded-xl auto-rows-min flex flex-col justify-between">
			<div class="profile-grid pb-6">
				<div class="cf-key">Student</div>
				<div class="cf-value">
					<a href={`../students/${contract.student.id}/`}>{contract.student.name}</a>
				</div>

				<div class="cf-key">Type</div>
				<div class="cf-value">
					{contract.type}
				</div>

				<div class="cf-key">Target year</div>
				<div class="cf-value">{contract.target_year}</div>

				<div class="cf-key">Date signed</div>
				<div class="cf-value">{contract.date_signed ?? 'n/a'}</div>

				<div class="cf-key">Prog. at signing</div>
				<div class="cf-value">{contract.student_progression_at_signing || 'n/a'}</div>

				<div class="cf-key">Status</div>
				<div class="cf-value">
					{contract.status === 'Effective' ? 'In effect' : contract.status}
				</div>
			</div>

			{#if userCanEdit}
				<div class="flex gap-4">
					<button class="section-cta" on:click={() => contractUpdateDialog.showModal()}>Edit</button
					>
					<button class="section-cta delete" on:click={() => contractDeleteDialog.showModal()}
						>Delete</button
					>
				</div>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-8 auto-rows-min">
			{#each contract.services.sort(byServiceRoleThenUsername) as service}
				<div class="service-card cf-card-shadow rounded-xl px-6 py-4 flex flex-col">
					<div class="cf-key">{service.role}</div>
					<h2 class="h3 font-bold mt-0 pt-2">{service.cf_username}</h2>

					<div class="profile-grid py-4">
						<div class="cf-key">From</div>
						<div class="cf-value">{service.start_date ?? 'n/a'}</div>

						<div class="cf-key">Until</div>
						<div class="cf-value">{formatEndDate(service.end_date, contract.status)}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</PageSection>

<Dialog exitHelper bind:dialog={contractUpdateDialog}>
	<ContractUpdateForm
		bind:dialog={contractUpdateDialog}
		action="?/updateContract"
		data={data.contractForm}
	/>
</Dialog>

<OkayCancelDialog
	title="Delete this contract?"
	bind:dialog={contractDeleteDialog}
	onOkay={handleDeleteContract}
	okayButtonText="Yes"
	cancelButtonText="No"
	dangerous
/>

<style lang="postcss">
	.service-card .profile-grid {
		@apply gap-y-1 gap-x-4;
	}
</style>
