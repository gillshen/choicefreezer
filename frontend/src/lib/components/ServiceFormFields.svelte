<script lang="ts">
	import type { UserListItem } from '$lib/types/userTypes.js';
	import { PLANNER, ASST_PLANNER, STRAT_PLANNER, ESSAY_ADVISOR } from '$lib/constants/cfRoles';

	import FormSelect from '$lib/components/FormSelect.svelte';
	import OptionList from '$lib/components/OptionList.svelte';

	export let form: any;
	export let errors: any;
	export let planners: UserListItem[];
	export let essayAdvisors: UserListItem[];
	export let specialPeople: UserListItem[];
</script>

<FormSelect id="planner-select" name="cf_planner" label={PLANNER} {form} {errors}>
	<OptionList options={planners} valueField="id" textField="username" />
</FormSelect>

<FormSelect
	id="asst-planner-select"
	name="cf_asst_planner"
	label={ASST_PLANNER}
	{form}
	{errors}
	optional
>
	<OptionList options={planners} valueField="id" textField="username" insertNullRow />
</FormSelect>

<FormSelect
	id="strat-planner-select"
	name="cf_strat_planner"
	label={STRAT_PLANNER}
	{form}
	{errors}
	optional
>
	<OptionList options={specialPeople} valueField="id" textField="username" insertNullRow />
</FormSelect>

<FormSelect
	id="essay-advisor-1-select"
	name="cf_essay_advisor_1"
	label={`${ESSAY_ADVISOR} 1`}
	{form}
	{errors}
>
	<OptionList options={essayAdvisors} valueField="id" textField="username" />
</FormSelect>

<FormSelect
	id="essay-advisor-2-select"
	name="cf_essay_advisor_2"
	label={`${ESSAY_ADVISOR} 2`}
	{form}
	{errors}
	optional
>
	<OptionList options={essayAdvisors} valueField="id" textField="username" insertNullRow />
</FormSelect>
