const BASE = 'http://127.0.0.1:8000/api/';

async function get(url: string) {
	const response = await fetch(`${BASE}${url}`);
	return await response.json();
}

async function post(url: string, data: any) {
	return await fetch(`${BASE}${url}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}

async function patch(url: string, data: any) {
	return await fetch(`${BASE}${url}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	});
}

export async function fetchUser(username: string) {
	return await get(`cf/${username}/`);
}

export async function fetchUsers() {
	return await get('cf/');
}

export async function createStudent(data: any) {
	return await post('students/new/', data);
}

export async function fetchStudent(id: number) {
	return await get(`students/${id}/`);
}

export async function patchStudent(id: number, data: any) {
	return await patch(`students/${id}/update/`, data);
}

export async function fetchStudents() {
	return await get('students/');
}

export async function fetchStudentsOfUser(username: string) {
	return await get(`students/?username=${username}`);
}

export async function createContract(data: any) {
	return await post('contracts/new/', data);
}

export async function fetchContracts(studentId: number) {
	return await get(`contracts/?student=${studentId}`);
}

export async function createService(data: any) {
	return await post('services/new/', data);
}

export async function fetchSchool(id: number) {
	return await get(`schools/${id}/`);
}

export async function fetchSchools() {
	return await get('schools/');
}

export async function fetchProgram(id: number) {
	return await get(`programs/${id}/`);
}

export async function fetchPrograms() {
	return await get('programs/');
}

export async function fetchTarget(id: number) {
	return await get(`targets/${id}/`);
}

export async function fetchRequirementsOfTarget(targetId: number) {
	return await get(`reqs/${targetId}/`);
}

export async function fetchSubTargetsOfTarget(targetId: number) {
	return await get(`subtargets/?target=${targetId}`);
}

export async function fetchApplication(id: number) {
	return await get(`applications/${id}/`);
}

export async function fetchApplications() {
	return await get('applications/');
}

export async function fetchApplicationsOfUser(username: string) {
	return await get(`applications/?username=${username}`);
}

export async function fetchApplicationsOfStudent(studentId: number) {
	return await get(`applications/?student=${studentId}`);
}

export async function fetchApplicationsOfSchool(schoolId: number) {
	return await get(`applications/?school=${schoolId}`);
}

export async function fetchApplicationsOfProgram(programId: number) {
	return await get(`applications/?program=${programId}`);
}

export async function fetchApplicationsOfTarget(targetId: number) {
	return await get(`applications/?target=${targetId}`);
}

export async function fetchLogsOfApplication(applicationId: number) {
	return await get(`application_logs/?application=${applicationId}`);
}

export async function fetchLogsOfStudents(studentId: number) {
	return await get(`s.logs/?student=${studentId}`);
}

export async function fetchEnrollments(studentId: number) {
	return await get(`s.enrollments/?student=${studentId}`);
}

export async function fetchTOEFL(studentId: number) {
	return await get(`s.toefl/?student=${studentId}`);
}

export async function fetchIELTS(studentId: number) {
	return await get(`s.ielts/?student=${studentId}`);
}

export async function fetchDET(studentId: number) {
	return await get(`s.det/?student=${studentId}`);
}

export async function fetchSAT(studentId: number) {
	return await get(`s.sat/?student=${studentId}`);
}

export async function fetchACT(studentId: number) {
	return await get(`s.act/?student=${studentId}`);
}

export async function fetchAP(studentId: number) {
	return await get(`s.ap/?student=${studentId}`);
}

export async function fetchGRE(studentId: number) {
	return await get(`s.gre/?student=${studentId}`);
}
