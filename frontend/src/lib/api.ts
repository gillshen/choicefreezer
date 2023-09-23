import type { UserListItem } from '$lib/types/userTypes';
import type { StudentListItemType } from '$lib/types/studentTypes';
import type { ContractListItem, ContractPageData } from '$lib/types/contractTypes';
import type { NewSchool, SchoolListItem } from './types/schoolTypes';
import type { NewProgram, ProgramListItem, ProgramSelectItem } from '$lib/types/programTypes';
import type { NewTarget } from '$lib/types/targetTypes';
import type { NewSubTarget } from '$lib/types/subTargetTypes';
import type {
	ApplicationListItem,
	ApplicationPageData,
	NewApplication
} from '$lib/types/applicationTypes';
import type { NewMajorChoice } from '$lib/types/majorChoiceTypes';
import type { NewApplicationLog } from '$lib/types/applicationLogTypes';
import type { NewUserLog, UserLogListItem } from '$lib/types/userLogTypes';
import type {
	EnrollmentListItem,
	EnrollmentPageData,
	NewClassRank,
	NewEnrollment,
	NewGpa
} from '$lib/types/enrollmentTypes';
import type {
	ActScore,
	AlevelGrade,
	ApScore,
	DetScore,
	GmatScore,
	GreScore,
	IbGrade,
	IeltsScore,
	LsatScore,
	NewActScore,
	NewAlevelGrade,
	NewApScore,
	NewDetScore,
	NewGmatScore,
	NewGreScore,
	NewIbGrade,
	NewIeltsScore,
	NewLsatScore,
	NewSatScore,
	NewToeflScore,
	SatScore,
	ToeflScore
} from '$lib/types/testScoreTypes';

import { PLANNER, ASST_PLANNER, STRAT_PLANNER, ESSAY_ADVISOR } from '$lib/constants/cfRoles';

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

export async function authenticate(credentials: { username: string; password: string }) {
	return await post('token/', credentials);
}

export async function fetchUser(username: string) {
	return await get(`cf/${username}/`);
}

export async function patchUser(username: string, data: any) {
	return await patch(`cf/${username}/update/`, data);
}

export async function resetUserPassword(username: string, data: { password: string }) {
	return await patch(`cf/${username}/reset_password/`, data);
}

export async function fetchUsers(): Promise<UserListItem[]> {
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
export async function deleteStudent(id: number) {
	return await destroy(`students/${id}/delete/`);
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

export async function patchService(serviceId: number, data: any) {
	return await patch(`services/${serviceId}/update/`, data);
}

export async function deleteService(serviceId: number) {
	return await destroy(`services/${serviceId}/delete/`);
}

export async function createSchool(data: NewSchool) {
	return await post('schools/new/', data);
}

export async function patchSchool(id: number, data: any) {
	return await patch(`schools/${id}/update/`, data);
}

export async function fetchSchool(id: number) {
	return await get(`schools/${id}/`);
}

export async function fetchSchools(): Promise<SchoolListItem[]> {
	return await get('schools/');
}

export async function createProgram(data: NewProgram) {
	return await post('programs/new/', data);
}

export async function patchProgram(id: number, data: any) {
	return await patch(`programs/${id}/update/`, data);
}

export async function fetchProgram(id: number) {
	return await get(`programs/${id}/`);
}

export async function fetchPrograms(): Promise<ProgramListItem[]> {
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

export async function patchSubTarget(subTargetId: number, data: any) {
	return await patch(`subtargets/${subTargetId}/update/`, data);
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

export async function patchApplication(id: number, data: any) {
	return await patch(`applications/${id}/update/`, data);
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

export async function patchMajorChoice(choiceId: number, data: any) {
	return await patch(`major_choices/${choiceId}/update/`, data);
}

export async function deleteMajorChoice(choiceId: number) {
	return await destroy(`major_choices/${choiceId}/delete/`);
}

export async function createApplicationLog(data: NewApplicationLog) {
	return await post(`application_logs/new/`, data);
}

export async function fetchLogsOfApplication(applicationId: number) {
	return await get(`application_logs/?application=${applicationId}`);
}

export async function deleteApplicationLog(logId: number) {
	return await destroy(`application_logs/${logId}/delete/`);
}

export async function createEnrollment(data: NewEnrollment) {
	return await post('s.enrollments/new/', data);
}

export async function fetchEnrollment(enrollmentId: number): Promise<EnrollmentPageData> {
	return await get(`s.enrollments/${enrollmentId}/`);
}

export async function patchEnrollment(enrollmentId: number, data: any) {
	return await patch(`s.enrollments/${enrollmentId}/update/`, data);
}

export async function deleteEnrollment(enrollmentId: number) {
	return await destroy(`s.enrollments/${enrollmentId}/delete/`);
}

export async function fetchEnrollments(studentId: number): Promise<EnrollmentListItem[]> {
	return await get(`s.enrollments/?student=${studentId}`);
}

export async function createGpa(data: NewGpa) {
	return await post('s.gpa/new/', data);
}

export async function patchGpa(gpaId: number, data: any) {
	return await patch(`s.gpa/${gpaId}/update/`, data);
}

export async function deleteGpa(gpaId: number) {
	return await destroy(`s.gpa/${gpaId}/delete/`);
}

export async function createClassRank(data: NewClassRank) {
	return await post('s.class_ranks/new/', data);
}

export async function patchClassRank(rankId: number, data: any) {
	return await patch(`s.class_ranks/${rankId}/update/`, data);
}

export async function deleteClassRank(rankId: number) {
	return await destroy(`s.class_ranks/${rankId}/delete/`);
}

export async function createToeflScore(data: NewToeflScore) {
	return await post('s.toefl/new/', data);
}

export async function patchToeflScore(scoreId: number, data: any) {
	return await patch(`s.toefl/${scoreId}/update/`, data);
}

export async function deleteToeflScore(scoreId: number) {
	return await destroy(`s.toefl/${scoreId}/delete/`);
}

export async function fetchToeflScores(studentId: number): Promise<ToeflScore[]> {
	return await get(`s.toefl/?student=${studentId}`);
}

export async function createIeltsScore(data: NewIeltsScore) {
	return await post('s.ielts/new/', data);
}

export async function patchIeltsScore(scoreId: number, data: any) {
	return await patch(`s.ielts/${scoreId}/update/`, data);
}

export async function deleteIeltsScore(scoreId: number) {
	return await destroy(`s.ielts/${scoreId}/delete/`);
}

export async function fetchIeltsScores(studentId: number): Promise<IeltsScore[]> {
	return await get(`s.ielts/?student=${studentId}`);
}

export async function createDetScore(data: NewDetScore) {
	return await post('s.det/new/', data);
}

export async function patchDetScore(scoreId: number, data: any) {
	return await patch(`s.det/${scoreId}/update/`, data);
}

export async function deleteDetScore(scoreId: number) {
	return await destroy(`s.det/${scoreId}/delete/`);
}

export async function fetchDetScores(studentId: number): Promise<DetScore[]> {
	return await get(`s.det/?student=${studentId}`);
}

export async function createSatScore(data: NewSatScore) {
	return await post('s.sat/new/', data);
}

export async function patchSatScore(scoreId: number, data: any) {
	return await patch(`s.sat/${scoreId}/update/`, data);
}

export async function deleteSatScore(scoreId: number) {
	return await destroy(`s.sat/${scoreId}/delete/`);
}

export async function fetchSatScores(studentId: number): Promise<SatScore[]> {
	return await get(`s.sat/?student=${studentId}`);
}

export async function createActScore(data: NewActScore) {
	return await post('s.act/new/', data);
}

export async function patchActScore(scoreId: number, data: any) {
	return await patch(`s.act/${scoreId}/update/`, data);
}

export async function deleteActScore(scoreId: number) {
	return await destroy(`s.act/${scoreId}/delete/`);
}

export async function fetchActScores(studentId: number): Promise<ActScore[]> {
	return await get(`s.act/?student=${studentId}`);
}

export async function createApScore(data: NewApScore) {
	return await post('s.ap/new/', data);
}

export async function patchApScore(scoreId: number, data: any) {
	return await patch(`s.ap/${scoreId}/update/`, data);
}

export async function deleteApScore(scoreId: number) {
	return await destroy(`s.ap/${scoreId}/delete/`);
}

export async function fetchApScores(studentId: number): Promise<ApScore[]> {
	return await get(`s.ap/?student=${studentId}`);
}

export async function createIbPredictedGrade(data: NewIbGrade) {
	return await post('s.ib_predicted/new/', data);
}

export async function patchIbPredictedGrade(scoreId: number, data: any) {
	return await patch(`s.ib_predicted/${scoreId}/update/`, data);
}

export async function deleteIbPredictedGrade(scoreId: number) {
	return await destroy(`s.ib_predicted/${scoreId}/delete/`);
}

export async function fetchIbPredictedGrades(studentId: number): Promise<IbGrade[]> {
	return await get(`s.ib_predicted/?student=${studentId}`);
}

export async function createIbFinalGrade(data: NewIbGrade) {
	return await post('s.ib_final/new/', data);
}

export async function patchIbFinalGrade(scoreId: number, data: any) {
	return await patch(`s.ib_final/${scoreId}/update/`, data);
}

export async function deleteIbFinalGrade(scoreId: number) {
	return await destroy(`s.ib_final/${scoreId}/delete/`);
}

export async function fetchIbFinalGrades(studentId: number): Promise<IbGrade[]> {
	return await get(`s.ib_final/?student=${studentId}`);
}

export async function createAlevelPredictedGrade(data: NewAlevelGrade) {
	return await post('s.al_predicted/new/', data);
}

export async function patchAlevelPredictedGrade(scoreId: number, data: any) {
	return await patch(`s.al_predicted/${scoreId}/update/`, data);
}

export async function deleteAlevelPredictedGrade(scoreId: number) {
	return await destroy(`s.al_predicted/${scoreId}/delete/`);
}

export async function fetchAlevelPredictedGrades(studentId: number): Promise<AlevelGrade[]> {
	return await get(`s.al_predicted/?student=${studentId}`);
}

export async function createAlevelFinalGrade(data: NewAlevelGrade) {
	return await post('s.al_final/new/', data);
}

export async function patchAlevelFinalGrade(scoreId: number, data: any) {
	return await patch(`s.al_final/${scoreId}/update/`, data);
}

export async function deleteAlevelFinalGrade(scoreId: number) {
	return await destroy(`s.al_final/${scoreId}/delete/`);
}

export async function fetchAlevelFinalGrades(studentId: number): Promise<AlevelGrade[]> {
	return await get(`s.al_final/?student=${studentId}`);
}

export async function createGreScore(data: NewGreScore) {
	return await post('s.gre/new/', data);
}

export async function patchGreScore(scoreId: number, data: any) {
	return await patch(`s.gre/${scoreId}/update/`, data);
}

export async function deleteGreScore(scoreId: number) {
	return await destroy(`s.gre/${scoreId}/delete/`);
}

export async function fetchGreScores(studentId: number): Promise<GreScore[]> {
	return await get(`s.gre/?student=${studentId}`);
}

export async function createGmatScore(data: NewGmatScore) {
	return await post('s.gmat/new/', data);
}

export async function patchGmatScore(scoreId: number, data: any) {
	return await patch(`s.gmat/${scoreId}/update/`, data);
}

export async function deleteGmatScore(scoreId: number) {
	return await destroy(`s.gmat/${scoreId}/delete/`);
}

export async function fetchGmatScores(studentId: number): Promise<GmatScore[]> {
	return await get(`s.gmat/?student=${studentId}`);
}

export async function createLsatScore(data: NewLsatScore) {
	return await post('s.lsat/new/', data);
}

export async function patchLsatScore(scoreId: number, data: any) {
	return await patch(`s.lsat/${scoreId}/update/`, data);
}

export async function deleteLsatScore(scoreId: number) {
	return await destroy(`s.lsat/${scoreId}/delete/`);
}

export async function fetchLsatScores(studentId: number): Promise<LsatScore[]> {
	return await get(`s.lsat/?student=${studentId}`);
}

export async function createUserLog(data: NewUserLog) {
	return await post(`user_logs/new/`, data);
}

export async function patchUserLog(logId: number, data: any) {
	return await patch(`user_logs/${logId}/update/`, data);
}

export async function deleteUserLog(logId: number) {
	return await destroy(`user_logs/${logId}/delete/`);
}

export async function fetchLogsOfUser(username: string): Promise<UserLogListItem[]> {
	return await get(`user_logs/?username=${username}`);
}

export async function fetchLogsOfStudents(studentId: number): Promise<UserLogListItem[]> {
	return await get(`user_logs/?student=${studentId}`);
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
