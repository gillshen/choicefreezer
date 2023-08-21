export function formatStudentName(student: {
	last_name: string;
	first_name: string;
	last_name_first: boolean;
}) {
	return student.last_name_first
		? `${student.last_name}${student.first_name}`
		: `${student.first_name} ${student.last_name}`;
}

export function formatStudentRomanizedName(student: {
	last_name_romanized: string;
	first_name_romanized: string;
}) {
	return `${student.first_name_romanized} ${student.last_name_romanized}`.trim();
}

export function formatResidence(student: { city: string; state: string }) {
	if (student.city && student.state) {
		return `${student.city}, ${student.state}`;
	}
	return student.city || student.state;
}

export function byRomanizedName(
	a: { last_name_romanized: string; first_name_romanized: string },
	b: { last_name_romanized: string; first_name_romanized: string }
) {
	return (
		a.last_name_romanized.localeCompare(b.last_name_romanized) ||
		a.first_name_romanized.localeCompare(b.first_name_romanized)
	);
}

export function byTargetYearDesc(
	a: { latest_target_year: number },
	b: { latest_target_year: number }
) {
	if (a.latest_target_year > b.latest_target_year) {
		return -1;
	} else if (a.latest_target_year < b.latest_target_year) {
		return 1;
	} else {
		return 0;
	}
}

export function byContractType(
	a: { latest_contract_type: string },
	b: { latest_contract_type: string }
) {
	// Graduate < UG Freshman < UG Transfer
	return a.latest_contract_type.localeCompare(b.latest_contract_type);
}
