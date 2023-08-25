// https://bigfuture.collegeboard.org/explore-careers/majors
const majorCategories = [
	'Arts and Humanities',
	'Business',
	'Health and Medicine',
	'Interdisciplinary Studies',
	'Public and Social Services',
	'Science, Technology, Engineering, and Math',
	'Social Sciences',
	'Trades and Personal Services',
	'Undecided'
].sort();

export const MAJOR_CATEGORIES = [...majorCategories] as const;
