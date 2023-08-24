export const PLANNER = '顾问';
export const ASST_PLANNER = '服务顾问';
export const STRAT_PLANNER = '战略顾问';
export const ESSAY_ADVISOR = '文案';
export const PLUS_SUFFIX = '+';

export const CF_ROLES =
	// The order of display in dropdown lists
	[PLANNER, ASST_PLANNER, STRAT_PLANNER, ESSAY_ADVISOR] as const;

export const SERVICE_ROLE_ORDER: Record<string, number> =
	/*
	 * An object that maps roles to numbers
	 * in the order of display on the contract page:
	 * {
	 *   STRAT_PLANNER: 0,
	 *   PLANNER: 1,
	 *   ASST_PLANNER: 2,
	 *   ESSAY_ADVISOR: 3
	 * }
	 */
	[STRAT_PLANNER, PLANNER, ASST_PLANNER, ESSAY_ADVISOR].reduce(
		(obj: Record<string, number>, item, index) => {
			obj[item] = index;
			return obj;
		},
		{}
	);
