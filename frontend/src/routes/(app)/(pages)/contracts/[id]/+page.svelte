<script lang="ts">
	import { goto } from '$app/navigation';

	import type { Service } from '$lib/types/contractTypes.js';

	import Section from '$lib/components/Section.svelte';
	import ContractStatusChip from '$lib/components/ContractStatusChip.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import BinaryDialog from '$lib/components/BinaryDialog.svelte';
	import ContractUpdateForm from '$lib/forms/ContractUpdateForm.svelte';
	import { toast } from '$lib/utils/interactiveUtils.js';

	import { deleteContract } from '$lib/api.js';
	import { formatEndDate } from '$lib/utils/serviceUtils.js';
	import { byServiceRoleThenUsername } from '$lib/utils/sortUtils.js';
	import { UNKNOWN_ERROR } from '$lib/constants/messages.js';
	import EditIconButton from '$lib/components/EditIconButton.svelte';
	import DeleteIconButton from '$lib/components/DeleteIconButton.svelte';
	import { toShortDate } from '$lib/utils/dateUtils';

	export let data;

	let activeService: Service;

	let contractUpdateDialog: HTMLDialogElement;
	let contractDeleteDialog: HTMLDialogElement;
	let serviceCreateDialog: HTMLDialogElement;
	let serviceUpdateDialog: HTMLDialogElement;
	let serviceDeleteDialog: HTMLDialogElement;

	// TODO move to server side?
	async function handleDeleteContract() {
		const response = await deleteContract(contract.id);
		if (response.ok) {
			contractDeleteDialog.close();
			toast('Contract deleted. Redirecting...', 'success');
			setTimeout(() => goto(`../students/${contract.student.id}/`), 2000);
		} else {
			toast(UNKNOWN_ERROR, 'error');
		}
	}

	$: contract = data.contract;

	// Parties to the contract can edit
	$: userIsOwner = data.contract.services.map((s) => s.cf_username).includes(data.username);
</script>

<Section hero>
	<h1 class="cf-h1">
		<!-- <i class="fa-solid fa-file-signature mr-2" /> -->
		<span class="mr-6">
			{contract.student.name} &bullet;
			{contract.type}
			{contract.target_year}
		</span>
		<span>
			<ContractStatusChip status={contract.status} />
		</span>
	</h1>

	<div class="grid grid-cols-3 gap-16 h-full max-h-[960px]">
		<!-- basic info -->
		<article class="panel">
			<div class="flex-grow overflow-auto flex flex-col px-6 pt-6">
				<div class="flex flex-col gap-2">
					<div class="flex gap-2 items-baseline">
						<span class="text-xl font-bold">{contract.student.name}</span>
						<a href={`../students/${contract.student.id}/`} class="cf-page-link text-base"
							><i class="fa-solid fa-arrow-right" /></a
						>
					</div>

					<div class="mb-8">{contract.type} {contract.target_year}</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Date signed</div>
					<div>{contract.date_signed ? toShortDate(contract.date_signed) : 'n/a'}</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Student progression at signing</div>
					<div>{contract.student_progression_at_signing || 'n/a'}</div>
				</div>

				<div class="cf-entry">
					<div class="cf-entry-label">Status</div>
					<div>
						{contract.status === 'Effective' ? 'In effect' : contract.status}
					</div>
				</div>

				{#if userIsOwner}
					<footer class="flex gap-6 mt-auto">
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-primary-400 hover:text-primary-500"
							on:click={() => contractUpdateDialog.showModal()}>Edit</button
						>
						<button
							class="cf-btn flex gap-2 items-center pb-8 pt-4 text-error-400 hover:text-error-500"
							on:click={() => contractDeleteDialog.showModal()}>Delete</button
						>
					</footer>
				{/if}
			</div>
		</article>

		<div class="col-span-2 grid grid-cols-3 gap-8 auto-rows-min">
			{#each contract.services.sort(byServiceRoleThenUsername) as service}
				<div class="panel service-card fit-height p-6 pt-4">
					<div class="flex items-center h-[30px]">
						<div class="text-tertiary-400/90 text-sm mr-auto">{service.role}</div>

						<div class="service-card-actions -mr-2 flex items-center">
							{#if userIsOwner}
								<EditIconButton
									classNames="text-primary-400 hover:text-primary-500"
									onClick={() => {
										activeService = service;
										serviceUpdateDialog.showModal();
									}}
								/>
								<DeleteIconButton
									classNames="text-error-400 hover:text-error-500"
									onClick={() => {
										activeService = service;
										serviceDeleteDialog.showModal();
									}}
								/>
							{/if}
						</div>
					</div>

					<div class="text-xl font-bold font-heading-token mt-0 pt-2">{service.cf_username}</div>

					<div class="flex flex-col mt-6">
						<div class="cf-entry">
							<div class="cf-entry-label">Start date</div>
							<div>
								{service.start_date
									? toShortDate(service.start_date)
									: contract.date_signed
									? toShortDate(contract.date_signed)
									: 'n/a'}
							</div>
						</div>

						<div class="cf-entry">
							<div class="cf-entry-label">End date</div>
							<div>{formatEndDate(service.end_date, contract.status)}</div>
						</div>
					</div>
				</div>
			{/each}
			<button
				class="p-6 text-surface-200 font-heading-token text-sm border border-dashed border-surface-600 rounded-xl flex flex-col justify-center items-center hover:bg-surface-700"
				on:click={() => serviceCreateDialog.showModal()}
				><i class="fa-solid fa-plus mb-1 text-lg" />Add a member</button
			>
		</div>
	</div>
</Section>

<Dialog exitHelper bind:dialog={contractUpdateDialog}>
	<ContractUpdateForm
		bind:dialog={contractUpdateDialog}
		action="?/updateContract"
		data={data.contractForm}
	/>
</Dialog>

<BinaryDialog
	title="Delete this contract?"
	bind:dialog={contractDeleteDialog}
	onYes={handleDeleteContract}
	dangerous
/>

<Dialog exitHelper bind:dialog={serviceCreateDialog}>
	<p>TODO: service creation form</p>
</Dialog>

<Dialog exitHelper bind:dialog={serviceUpdateDialog}>
	<p>TODO: service update form</p>
</Dialog>

<BinaryDialog
	title={`Remove ${activeService?.cf_username ?? 'this member'} from the team?`}
	bind:dialog={serviceDeleteDialog}
	onYes={() => alert('todo')}
	dangerous
>
	<p>
		Do this only if {activeService?.cf_username ?? 'this member'} was never on the team in the first
		place. If s/he was but has left, click the Edit icon on the card and set a service end date.
	</p>
</BinaryDialog>

<style lang="postcss">
	.cf-entry-label {
		@apply mb-1;
	}
	.service-card-actions {
		@apply opacity-0;
		@apply transition-opacity duration-200 ease-in-out;
	}
	.service-card:hover .service-card-actions {
		@apply opacity-100;
	}
</style>
