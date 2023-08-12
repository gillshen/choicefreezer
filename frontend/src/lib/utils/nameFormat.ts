export function formatStudentName(student: {
	last_name: string;
	first_name: string;
	name_in_chinese: boolean;
}) {
	return student.name_in_chinese
		? `${student.last_name}${student.first_name}`
		: `${student.first_name} ${student.last_name}`;
}
