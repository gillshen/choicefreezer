<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const { form, message, enhance } = superForm(data.authenticationForm, {});
</script>

<div class="flex justify-center items-center w-full h-full">
	<div class="max-w-[22rem] px-12 pt-8 py-12 mb-20 bg-surface-800 rounded-xl">
		<h1 class="cf-h1">Log in</h1>

		<form method="post" class="flex flex-col gap-2" action="?/login" use:enhance>
			<div>
				<label class="label" for="username-input">Username</label>
				<input
					id="username-input"
					name="username"
					type="text"
					class="input max-w-full"
					bind:value={$form.username}
					required
				/>
			</div>

			<div>
				<label class="label" for="password-input">Password</label>
				<input
					id="username-input"
					name="password"
					type="password"
					class="input max-w-full"
					bind:value={$form.password}
					required
				/>
			</div>

			<div class="mt-8 flex flex-col gap-1 h-16">
				<button type="submit" class="btn cf-btn variant-filled-primary flex gap-2">
					Log in
					<i class="fa-solid fa-arrow-right-long" />
				</button>

				{#if $message}
					<small class="error-message max-w-sm">{$message}</small>
				{/if}
			</div>
		</form>
	</div>
</div>
