<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';

	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import { toast } from '$lib/utils/interactiveUtils.js';
	import { BANNER } from '$lib/constants/messages.js';

	export let data;

	const {
		form: bannerForm,
		errors: bannerErrors,
		message: bannerMessage,
		enhance: bannerEnhance
	} = superForm(data.bannersUpdateForm, {
		id: 'bannersUpdate',
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast('Banners updated', 'success');
			}
		}
	});

	const {
		form: passwordForm,
		errors: passwordErrors,
		message: passwordMessage,
		enhance: passwordEnhance
	} = superForm(data.passwordResetForm, {
		id: 'passwordUpdate',
		scrollToError: 'auto',
		taintedMessage: null,
		onResult: ({ result }) => {
			if (result.type === 'success') {
				toast('Password updated', 'success');
				setTimeout(() => goto('../login'), 2000);
			}
		}
	});
</script>

<h1>Hello, {data.username}</h1>

<PageSection>
	<svelte:fragment slot="h2">Change banners</svelte:fragment>

	<form method="post" action="?/updateBanners" novalidate use:bannerEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField id="username-field" name="username" value={data.username} />

			<FormTextInput
				id="public-banner-input"
				name="public_banner"
				label="Public banner (100 characters max)"
				form={$bannerForm}
				errors={$bannerErrors}
				placeholder={`${data.username}${BANNER}`}
				width="wider"
			/>

			<FormTextInput
				id="private-banner-input"
				name="private_banner"
				label="Private banner (100 characters max)"
				form={$bannerForm}
				errors={$bannerErrors}
				placeholder={`${data.username}${BANNER}`}
				width="wider"
			/>
		</fieldset>

		<FormSubmit message={$bannerMessage} buttonText="Change" />
	</form>
</PageSection>

<PageSection>
	<svelte:fragment slot="h2">Change password</svelte:fragment>

	<form method="post" action="?/resetPassword" novalidate use:passwordEnhance>
		<fieldset>
			<legend class="empty" />
			<HiddenIdField id="username-field" name="username" value={data.username} />

			<div class="flex flex-col">
				<label class="label flex flex-col" for="password-input"
					>New password
					<ul class="list-disc list-inside my-2 text-tertiary-300">
						<li><small>At least 8 characters</small></li>
						<li><small>Must not contain your username</small></li>
						<li><small>Must not be entirely numeric</small></li>
					</ul>
				</label>
				<input
					id="username-input"
					name="password"
					type="password"
					class="input"
					bind:value={$passwordForm.password}
					required
				/>
				{#if $passwordErrors.password}
					<small class="error-message">{$passwordErrors.password}</small>
				{/if}
			</div>
		</fieldset>

		<FormSubmit message={$passwordMessage} buttonText="Change" />
	</form>
</PageSection>
