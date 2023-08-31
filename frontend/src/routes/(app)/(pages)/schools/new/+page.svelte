<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PageSection from '$lib/components/PageSection.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';
	import SchoolFormFields from '$lib/components/SchoolFormFields.svelte';

	export let data;

	const { form, errors, message, enhance } = superForm(data.form, { scrollToError: 'auto' });
</script>

<h1 class="font-normal">Add a school</h1>

<PageSection>
	<form class="w-fit" method="post" action="?/createSchool" novalidate use:enhance>
		<SchoolFormFields form={$form} errors={$errors} />

		<fieldset>
			<FormCheckInput
				id="ug-freshman-check"
				name="ugFreshmanRelevant"
				label="This school offers an undergraduate freshman program that our students may possibly want to apply to"
				form={$form}
			/>

			<FormCheckInput
				id="ug-transfer-check"
				name="ugTransferRelevant"
				label="This school offers an undergraduate transfer program that our students may possibly want to apply to"
				form={$form}
			/>
		</fieldset>

		<FormSubmit message={$message} />
	</form>
</PageSection>
