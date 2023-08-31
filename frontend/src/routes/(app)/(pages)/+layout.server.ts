import { superValidate } from 'sveltekit-superforms/server';
import { newUserLogSchema } from '$lib/schemas';

export async function load(event) {
	const userLogForm = await superValidate(event, newUserLogSchema);
	return { userLogForm };
}
