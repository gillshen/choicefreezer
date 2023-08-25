<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import type { UserListItem } from '$lib/types/userTypes.js';
	import PageSection from '$lib/components/PageSection.svelte';
	import StudentLegalNameFields from '$lib/components/StudentLegalNameFields.svelte';
	import StudentRomanizedNameFields from '$lib/components/StudentRomanizedNameFields.svelte';
	import StudentGenderField from '$lib/components/StudentGenderField.svelte';
	import StudentCitizenshipField from '$lib/components/StudentCitizenshipField.svelte';
	import StudentDobField from '$lib/components/StudentDobField.svelte';
	import StudentResidenceFields from '$lib/components/StudentResidenceFields.svelte';
	import ContractFormFields from '$lib/components/ContractFormFields.svelte';
	import ServiceFormFields from '$lib/components/ServiceFormFields.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';

	import {
		filterForEssayAdvisors,
		filterForPlanners,
		filterForSpecial,
		sortByUsername
	} from '$lib/utils/userUtils.js';

	export let data;
	const cfPeople: UserListItem[] = data.cfPeople;
	const { form, errors, message, enhance } = superForm(data.form, { scrollToError: 'auto' });

	const planners = sortByUsername(filterForPlanners(cfPeople));
	const essayAdvisors = sortByUsername(filterForEssayAdvisors(cfPeople));
	const specialPeople = sortByUsername(filterForSpecial(cfPeople));
</script>

<h1 class="font-normal">Add a student</h1>

<PageSection>
	<!-- <SuperDebug data={$form} /> -->

	<form class="w-fit" method="post" novalidate use:enhance>
		<fieldset>
			<legend>Legal name</legend>
			<StudentLegalNameFields form={$form} errors={$errors} />
		</fieldset>

		<fieldset>
			<legend>Name in English/Pinyin</legend>
			<StudentRomanizedNameFields form={$form} errors={$errors} />
		</fieldset>

		<fieldset class="single-column">
			<legend>Personal information</legend>
			<StudentGenderField form={$form} errors={$errors} />
			<StudentCitizenshipField form={$form} errors={$errors} />
			<StudentDobField form={$form} errors={$errors} />
		</fieldset>

		<fieldset>
			<legend>Residence</legend>
			<StudentResidenceFields form={$form} errors={$errors} />
		</fieldset>

		<fieldset class="single-column">
			<legend>Contract</legend>
			<ContractFormFields form={$form} errors={$errors} />
		</fieldset>

		<fieldset class="single-column">
			<legend>CF team</legend>
			<ServiceFormFields form={$form} errors={$errors} {planners} {essayAdvisors} {specialPeople} />
		</fieldset>

		<FormSubmit message={$message} />
	</form>
</PageSection>

<style lang="postcss">
	fieldset {
		@apply grid grid-cols-[minmax(20rem,1fr)_minmax(20rem,1fr)] gap-8 gap-y-4;
	}
	fieldset.single-column {
		@apply grid grid-cols-1 max-w-[20rem];
	}
</style>
