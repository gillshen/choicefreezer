import type { StudentListItemType } from './types/studentTypes';
import type { ContractListItem, ContractPageData } from './types/contractTypes';
import type { School } from './types/schoolTypes';
import type { NewProgram, ProgramSelectItem } from './types/programTypes';
import type { NewTarget } from './types/targetTypes';
import type { NewSubTarget } from './types/subTargetTypes';
import type {
	ApplicationListItem,
	ApplicationPageData,
	NewApplication
} from './types/applicationTypes';
import type { NewMajorChoice } from './types/majorChoiceTypes';
import type { NewApplicationLog } from './types/applicationLogTypes';

import { PLANNER, ASST_PLANNER, STRAT_PLANNER, ESSAY_ADVISOR } from './constants/cfRoles';

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

async function destroy(url: string) {
	return await fetch(`${BASE}${url}`, { method: 'DELETE' });
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

export async function fetchStudents(): Promise<StudentListItemType[]> {
	return await get('students/');
}

export async function createContract(data: any) {
	return await post('contracts/new/', data);
}

export async function fetchContract(contractId: number): Promise<ContractPageData> {
	return await get(`contracts/${contractId}/`);
}

export async function patchContract(contractId: number, data: any) {
	return await patch(`contracts/${contractId}/update/`, data);
}

export async function deleteContract(contractId: number) {
	return await destroy(`contracts/${contractId}/delete/`);
}

export async function fetchContractsOfStudent(studentId: number): Promise<ContractListItem[]> {
	return await get(`contracts/?student=${studentId}`);
}

export async function createService(data: any) {
	return await post('services/new/', data);
}

export async function deleteService(serviceId: number) {
	return await destroy(`services/${serviceId}/delete/`);
}

export async function fetchSchool(id: number) {
	return await get(`schools/${id}/`);
}

export async function fetchSchools(): Promise<School[]> {
	return await get('schools/');
}

export async function createProgram(data: NewProgram) {
	return await post('programs/new/', data);
}

export async function fetchProgram(id: number) {
	return await get(`programs/${id}/`);
}

export async function fetchPrograms() {
	return await get('programs/');
}

export async function fetchProgramSelectList(): Promise<ProgramSelectItem[]> {
	return await get('programs/select/');
}

export async function fetchOrCreateTarget(data: NewTarget) {
	return await post('targets/new/', data);
}

export async function fetchTarget(id: number) {
	return await get(`targets/${id}/`);
}

export async function fetchRequirementsOfTarget(targetId: number) {
	return await get(`reqs/${targetId}/`);
}

export async function fetchOrCreateSubTarget(data: NewSubTarget) {
	return await post('subtargets/new/', data);
}

export async function fetchSubTargetsOfTarget(targetId: number) {
	return await get(`subtargets/?target=${targetId}`);
}

export async function createApplication(data: NewApplication) {
	return await post('applications/new/', data);
}

export async function fetchApplication(id: number): Promise<ApplicationPageData> {
	return await get(`applications/${id}/`);
}

export async function deleteApplication(id: number) {
	return await destroy(`applications/${id}/delete/`);
}

export async function fetchApplications(): Promise<ApplicationListItem[]> {
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

export async function createMajorChoice(data: NewMajorChoice) {
	return await post(`major_choices/new/`, data);
}

export async function createApplicationLog(data: NewApplicationLog) {
	return await post(`application_logs/new/`, data);
}

export async function fetchLogsOfApplication(applicationId: number) {
	return await get(`application_logs/?application=${applicationId}`);
}

export async function fetchLogsOfStudents(studentId: number) {
	return await get(`s.logs/?student=${studentId}`);
}

export async function deleteApplicationLog(logId: number) {
	return await destroy(`application_logs/${logId}/delete/`);
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

export async function performCreateContract(params: {
	studentId: number;
	formData: {
		type: string;
		target_year: number;
		date_signed: string | null;
		status: string;
		cf_planner: number;
		cf_asst_planner: number | null;
		cf_strat_planner: number | null;
		cf_essay_advisor_1: number;
		cf_essay_advisor_2: number | null;
	};
}) {
	const { studentId, formData } = params;
	const createContractResponse = await createContract({ student: studentId, ...formData });
	const newContract = await createContractResponse.json();

	const shared = {
		contract: newContract.id,
		start_date: formData.date_signed
	};

	await createService({ cf_person: formData.cf_planner, role: PLANNER, ...shared });

	if (formData.cf_asst_planner) {
		await createService({ cf_person: formData.cf_asst_planner, role: ASST_PLANNER, ...shared });
	}

	if (formData.cf_strat_planner) {
		await createService({ cf_person: formData.cf_strat_planner, role: STRAT_PLANNER, ...shared });
	}

	await createService({ cf_person: formData.cf_essay_advisor_1, role: ESSAY_ADVISOR, ...shared });

	if (formData.cf_essay_advisor_2) {
		await createService({ cf_person: formData.cf_essay_advisor_2, role: ESSAY_ADVISOR, ...shared });
	}
}
