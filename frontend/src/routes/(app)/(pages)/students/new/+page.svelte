<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { UserListItem } from '$lib/types/userTypes.js';
	import Section from '$lib/components/Section.svelte';

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

<Section hero long>
	<div class="flex flex-col items-center">
		<form class="w-full max-w-3xl" method="post" novalidate use:enhance>
			<h1 class="text-2xl font-heading-token font-bold">Add a student</h1>

			<fieldset>
				<legend>Legal name</legend>
				<StudentLegalNameFields form={$form} errors={$errors} />
			</fieldset>

			<fieldset>
				<legend>English name</legend>
				<StudentRomanizedNameFields form={$form} errors={$errors} />
			</fieldset>

			<fieldset>
				<legend>Personal information</legend>
				<StudentGenderField form={$form} errors={$errors} />
				<StudentCitizenshipField form={$form} errors={$errors} />
				<StudentDobField form={$form} errors={$errors} />
			</fieldset>

			<fieldset>
				<legend>Residence</legend>
				<StudentResidenceFields form={$form} errors={$errors} />
			</fieldset>

			<fieldset>
				<legend>Contract</legend>
				<ContractFormFields form={$form} errors={$errors} />
			</fieldset>

			<fieldset>
				<legend>CF team</legend>
				<ServiceFormFields
					form={$form}
					errors={$errors}
					{planners}
					{essayAdvisors}
					{specialPeople}
				/>
			</fieldset>

			<FormSubmit message={$message} />
		</form>
	</div>
</Section>
