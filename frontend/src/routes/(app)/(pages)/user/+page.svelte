<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';

	import Section from '$lib/components/Section.svelte';
	import FormSubmit from '$lib/components/FormSubmit.svelte';
	import FormTextInput from '$lib/components/FormTextInput.svelte';
	import HiddenIdField from '$lib/components/HiddenIdField.svelte';
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
				setTimeout(() => goto('/login'), 2000);
			}
		}
	});

	function onPasswordInputChange() {
		const pwd = $passwordForm.password;
		const charCountIndicator = document.getElementById('char-count-indicator') as HTMLElement;
		const noUsernameIndicator = document.getElementById('no-username-indicator') as HTMLElement;
		const notAllNumericIndicator = document.getElementById(
			'not-all-numeric-indicator'
		) as HTMLElement;

		if (pwd) {
			charCountIndicator.classList.remove('initial');
			noUsernameIndicator.classList.remove('initial');
			notAllNumericIndicator.classList.remove('initial');
		} else {
			charCountIndicator.classList.add('initial');
			noUsernameIndicator.classList.add('initial');
			notAllNumericIndicator.classList.add('initial');
		}

		if (pwd.length > 7) {
			charCountIndicator.classList.remove('failed');
		} else {
			charCountIndicator.classList.add('failed');
		}

		if (pwd.toLowerCase().includes(data.username.toLowerCase())) {
			noUsernameIndicator.classList.add('failed');
		} else {
			noUsernameIndicator.classList.remove('failed');
		}

		if (pwd.match(/^\d+$/)) {
			notAllNumericIndicator.classList.add('failed');
		} else {
			notAllNumericIndicator.classList.remove('failed');
		}
	}
</script>

<Section hero>
	<h1 class="cf-h1">Hello, {data.username}</h1>

	<div class="grid grid-cols-2 gap-12">
		<article class="panel transparent flex flex-col gap-4">
			<h2 class="cf-h2 font-bold py-2 border-t border-primary-400">Change banners</h2>

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

			<h2 class="cf-h2 font-bold py-2 border-t border-primary-400">Change avatar color</h2>
			<form method="post" novalidate>
				<fieldset>
					<legend class="empty" />

					(TODO)
				</fieldset>
			</form>
		</article>

		<article class="panel transparent flex flex-col gap-4">
			<h2 class="cf-h2 font-bold py-2 border-t border-primary-400">Change password</h2>

			<form method="post" action="?/resetPassword" novalidate use:passwordEnhance>
				<fieldset>
					<legend class="empty" />
					<HiddenIdField id="username-field" name="username" value={data.username} />

					<div class="flex flex-col">
						<label class="label flex flex-col" for="password-input"
							>New password
							<ul class="list-disc list-inside my-2">
								<li class="password-check-indicator failed initial" id="char-count-indicator">
									<small>At least 8 characters</small>
								</li>
								<li class="password-check-indicator failed initial" id="not-all-numeric-indicator">
									<small>Not entirely numeric</small>
								</li>
								<li class="password-check-indicator failed initial" id="no-username-indicator">
									<small>Not containing your username</small>
								</li>
							</ul>
						</label>
						<input
							id="username-input"
							name="password"
							type="password"
							class="input"
							bind:value={$passwordForm.password}
							required
							on:input={onPasswordInputChange}
						/>
						{#if $passwordErrors.password}
							<small class="error-message">{$passwordErrors.password}</small>
						{/if}
					</div>
				</fieldset>

				<FormSubmit message={$passwordMessage} buttonText="Change" />
			</form>
		</article>
	</div>
</Section>

<style lang="postcss">
	.password-check-indicator {
		@apply text-primary-400;
	}
	.password-check-indicator.failed {
		@apply text-error-400;
	}
	.password-check-indicator.initial {
		@apply text-warning-300;
	}
</style>
