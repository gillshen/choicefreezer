const COMMON_PLANS = ['Rolling', 'To Be Decided'];

export const UG_PLANS = ['ED', 'EA', 'REA', 'ED II', 'RD', 'Priority', ...COMMON_PLANS] as const;

export const NONUG_PLANS = [
	'Priority',
	'Regular',
	'Round 1',
	'Round 2',
	'Round 3',
	'Round 4',
	'Round 5',
	...COMMON_PLANS
] as const;
