const commonPlans = ['Rolling', 'To Be Decided'];

const ugPlans = ['ED', 'EA', 'REA', 'ED II', 'RD', 'Priority'];

const nonUgPlans = ['Priority', 'Regular', 'Round 1', 'Round 2', 'Round 3', 'Round 4', 'Round 5'];

export const UG_PLANS = [...ugPlans, ...commonPlans] as const;

export const NONUG_PLANS = [...nonUgPlans, ...commonPlans] as const;

export const ADMISSION_PLANS = [...ugPlans, ...nonUgPlans, ...commonPlans] as const;
