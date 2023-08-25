<script lang="ts">
	import FormTextInput from './FormTextInput.svelte';
	import FormSelect from './FormSelect.svelte';
	import OptionList from './OptionList.svelte';

	import { MAJOR_CATEGORIES } from '$lib/constants/majorCategories';

	export let rank: 'First' | 'Second' | 'Third';
	export let majorFieldName: string;
	export let majorCategoryFieldName: string;
	export let form: any;
	export let errors: any;

	const rankLower = rank.toLowerCase();
</script>

<FormTextInput
	id={`${rankLower}-major-input`}
	name={majorFieldName}
	label={`${rank} major`}
	{form}
	{errors}
	optional
	width="wider"
/>

<FormSelect
	id={`${rankLower}-major-category-select`}
	name={majorCategoryFieldName}
	label={`Category of the ${rank.toLowerCase()} major`}
	{form}
	{errors}
	optional
	optionalText="required if you specified a major"
	width="wider"
>
	<OptionList options={Array.from(MAJOR_CATEGORIES)} insertEmptyRow />
</FormSelect>
