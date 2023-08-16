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
	import OptionList from '$lib/components/OptionList.svelte';
	import FormSelect from '$lib/components/FormSelect.svelte';
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

<h1>Create a Student</h1>

<PageSection>
	<!-- <SuperDebug data={$form} /> -->

	<form method="post" novalidate use:enhance>
		<fieldset>
			<legend>Legal name</legend>
			<StudentLegalNameFields form={$form} errors={$errors} />
		</fieldset>

		<fieldset>
			<legend>Name in English/Pinyin</legend>
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
			<legend>Services</legend>

			<FormSelect id="planner-select" name="cf_planner" label="顾问" form={$form} errors={$errors}>
				<OptionList options={planners} valueField="id" textField="username" />
			</FormSelect>

			<FormSelect
				id="asst-planner-select"
				name="cf_asst_planner"
				label="服务顾问"
				form={$form}
				errors={$errors}
				optional
			>
				<OptionList options={planners} valueField="id" textField="username" insertNullRow />
			</FormSelect>

			<FormSelect
				id="strat-planner-select"
				name="cf_strat_planner"
				label="战略顾问"
				form={$form}
				errors={$errors}
				optional
			>
				<OptionList options={specialPeople} valueField="id" textField="username" insertNullRow />
			</FormSelect>

			<FormSelect
				id="essay-advisor-1-select"
				name="cf_essay_advisor_1"
				label="文案1"
				form={$form}
				errors={$errors}
			>
				<OptionList options={essayAdvisors} valueField="id" textField="username" />
			</FormSelect>

			<FormSelect
				id="essay-advisor-2-select"
				name="cf_essay_advisor_2"
				label="文案2"
				form={$form}
				errors={$errors}
				optional
			>
				<OptionList options={essayAdvisors} valueField="id" textField="username" insertNullRow />
			</FormSelect>
		</fieldset>

		<FormSubmit message={$message} />
	</form>
</PageSection>
