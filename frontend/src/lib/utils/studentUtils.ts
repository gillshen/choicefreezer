export function formatStudentName(student: {
	last_name: string;
	first_name: string;
	name_in_chinese: boolean;
}) {
	return student.name_in_chinese
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
