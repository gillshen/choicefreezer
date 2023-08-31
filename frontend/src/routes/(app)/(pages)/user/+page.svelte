<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import PageSection from '$lib/components/PageSection.svelte';

	export let data;

	const { form, errors, message, enhance } = superForm(data.bannersUpdateForm, {
		id: 'bannersUpdate'
	});
</script>

<h1>Hello, {data.username}</h1>

<PageSection>
	<svelte:fragment slot="h2">Change banners</svelte:fragment>

	<form method="post" action="?/updateBanners" novalidate use:enhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField id="username-field" name="username" value={data.username} />

			<FormTextInput
				id="public-banner-input"
				name="public_banner"
				label="Public banner (100 characters max)"
				form={$form}
				errors={$errors}
				placeholder={`${data.username}\u2019s Dojo Mojo Casa House`}
				width="wider"
			/>

			<FormTextInput
				id="private-banner-input"
				name="private_banner"
				label="Private banner (100 characters max)"
				form={$form}
				errors={$errors}
				placeholder={`${data.username}\u2019s Dojo Mojo Casa House`}
				width="wider"
			/>
		</fieldset>

		<FormSubmit message={$message} successText="Banners updated" />
	</form>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Change password</svelte:fragment>
</PageSection>
