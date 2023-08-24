<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
	import ContractStatusChip from '$lib/components/ContractStatusChip.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import OkayCancelDialog from '$lib/components/OkayCancelDialog.svelte';
	import { formatEndDate } from '$lib/utils/serviceUtils.js';

	import { deleteContract } from '$lib/api.js';
	import { goto } from '$app/navigation';
	import { UNKNOWN_ERROR } from '$lib/constants/messages.js';
	import { byServiceRoleThenUsername } from '$lib/utils/sortUtils.js';
	import ContractUpdateForm from '$lib/forms/ContractUpdateForm.svelte';

	export let data;
	const userCanEdit = 1;

	let contractUpdateDialog: HTMLDialogElement;
	let contractDeleteDialog: HTMLDialogElement;

	async function handleDeleteContract() {
		const response = await deleteContract(contract.id);
		if (response.ok) {
			goto(`../students/${contract.student.id}/`);
			alert('Contract deleted');
		} else {
			alert(UNKNOWN_ERROR);
		}
	}

	$: contract = data.contract;
</script>

<h1>
	&copy; {contract.student.name} &bullet;
	{contract.type}
	{contract.target_year}

	<div class="mt-8 max-w-[10rem] min-w-[10rem]">
		<ContractStatusChip status={contract.status} />
	</div>
</h1>

<PageSection>
	<div class="grid grid-cols-[1fr_1fr] gap-x-12 gap-y-8 auto-rows-min items-start">
		<div class="cf-card-shadow px-8 py-6 rounded-xl auto-rows-min flex flex-col justify-between">
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
				<div class="grid grid-cols-3 gap-4">
					<button class="section-cta" on:click={() => contractUpdateDialog.showModal()}>Edit</button
					>
					<button class="section-cta delete" on:click={() => contractDeleteDialog.showModal()}
						>Delete</button
					>
				</div>
			{/if}
		</div>

		<div class="flex flex-col">
			<div class="grid grid-cols-2 gap-8 auto-rows-min">
				{#each contract.services.sort(byServiceRoleThenUsername) as service}
					<div class="service-card cf-card-shadow rounded-xl px-4 py-4">
						<div class="flex flex-col gap-4">
							<div>
								<div class="text-surface-400">{service.role}</div>
								<h2 class="h3 font-bold mt-0 pt-2">{service.cf_username}</h2>
							</div>

							<div class="profile-grid pb-4">
								<div class="cf-key">From</div>
								<div class="cf-value">{service.start_date ?? 'n/a'}</div>

								<div class="cf-key">Until</div>
								<div class="cf-value">{formatEndDate(service.end_date, contract.status)}</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if userCanEdit}
				<div class="grid grid-cols-2 gap-8">
					<button class="section-cta mt-0 flex gap-2" disabled
						><i class="fa-solid fa-plus-minus" /> members</button
					>
				</div>
			{/if}
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