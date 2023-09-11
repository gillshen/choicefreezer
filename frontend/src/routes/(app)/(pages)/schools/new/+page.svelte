<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import Section from '$lib/components/Section.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormCheckInput from '$lib/components/FormCheckInput.svelte';
	import SchoolFormFields from '$lib/components/SchoolFormFields.svelte';

	export let data;

	const { form, errors, message, enhance } = superForm(data.form, { scrollToError: 'auto' });
</script>

<Section hero long>
	<div class="flex flex-col items-center">
		<form class="w-fit" method="post" action="?/createSchool" novalidate use:enhance>
			<h1 class="cf-h1">Add a school or institution</h1>

			<SchoolFormFields form={$form} errors={$errors} />

			<fieldset>
				<FormCheckInput
					id="ug-freshman-check"
					name="ugFreshmanRelevant"
					label="This school has an undergraduate freshman program that our students may possibly apply to"
					form={$form}
				/>

				<FormCheckInput
					id="ug-transfer-check"
					name="ugTransferRelevant"
					label="This school has an undergraduate transfer program that our students may possibly apply to"
					form={$form}
				/>
			</fieldset>

			<FormSubmit message={$message} />
		</form>
	</div>
</Section>
