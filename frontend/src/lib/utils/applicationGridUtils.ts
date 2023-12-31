import type {
	ICellRendererParams,
	ValueFormatterParams,
	ValueGetterParams
} from 'ag-grid-community';

import type { SubTarget } from '$lib/types/subTargetTypes';
import type { ApplicationListItem } from '$lib/types/applicationTypes';

import type {
	ToeflScore,
	IeltsScore,
	DetScore,
	SatScore,
	ActScore,
	ApScore,
	IbGrade,
	AlevelGrade,
	GreScore,
	GmatScore,
	LsatScore
} from '$lib/types/testScoreTypes';

import { AgCellRenderer } from '$lib/utils/gridUtils';
import { statusToClass, getBestScore } from '$lib/utils/applicationUtils';
import { makeDate, toShortDate, toTime } from '$lib/utils/dateUtils';
import { TIMEZONES_MAP } from '$lib/constants/timezones';

export class ApplicationIdRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('a');
		this.eGui.href = `/applications/${params.data.id}`;
		this.eGui.innerHTML = '<i class="fa-solid fa-arrow-right" />';
	}
}

export class ApplicantRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		this.eGui = document.createElement('a');
		this.eGui.href = `/students/${params.data.student.id}`;
		this.eGui.innerText = params.data.student.name;
	}
}

export class ProgramRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		const { program } = params.data;
		this.eGui = document.createElement('a');
		this.eGui.href = `/programs/${program.id}`;
		this.eGui.innerText = program.display_name;
	}
}

export class TargetRenderer extends AgCellRenderer {
	declare eGui: HTMLAnchorElement;

	init(params: ICellRendererParams<any, any, any>): void {
		const { target } = params.data;
		this.eGui = document.createElement('a');
		this.eGui.href = `/targets/${target.id}`;
		this.eGui.innerText = `${target.term} ${target.year}`;
	}
}

export class StatusRenderer extends AgCellRenderer {
	declare eGui: HTMLDivElement;

	init(params: ICellRendererParams<any, any, any>): void {
		const { latest_log } = params.data;
		this.eGui = document.createElement('div');

		if (!latest_log) {
			this.eGui.innerHTML = '';
			return;
		}
		this.eGui.classList.add('flex', 'gap-2', 'items-center');

		const statusDot = document.createElement('div');
		statusDot.classList.add('app-status-dot', statusToClass(latest_log.status));
		this.eGui.appendChild(statusDot);

		const statusText = document.createElement('div');
		statusText.classList.add('app-status-dot-text');
		statusText.innerText = latest_log.status;
		this.eGui.appendChild(statusText);
	}
}

export function schoolValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return application.schools.map((s) => s.name).join(' | ');
}

export function schoolAbbreviationsValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return application.schools.map((s) => s.abbreviation).join(' | ');
}

export function targetValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return `${application.target.term} ${application.target.year}`;
}

export function majorsValueGetter(params: ValueGetterParams): string {
	const application: ApplicationListItem = params.data;
	return application.majors_list.join('; ');
}

export function toeflBestScoreGetter(params: ValueGetterParams): number | null {
	const toeflScores: ToeflScore[] = params.data.toefl_submitted;
	return getBestScore(toeflScores);
}

export function ieltsBestScoreGetter(params: ValueGetterParams): number | null {
	const ieltsScores: IeltsScore[] = params.data.ielts_submitted;
	return getBestScore(ieltsScores);
}

export function detBestScoreGetter(params: ValueGetterParams): number | null {
	const detScores: DetScore[] = params.data.det_submitted;
	return getBestScore(detScores);
}

export function satBestScoreGetter(params: ValueGetterParams): number | null {
	const satScores: SatScore[] = params.data.sat_submitted;
	return getBestScore(satScores);
}

export function actBestScoreGetter(params: ValueGetterParams): number | null {
	const actScores: ActScore[] = params.data.act_submitted;
	return getBestScore(actScores);
}

export function greBestScoreGetter(params: ValueGetterParams): number | null {
	const greScores: GreScore[] = params.data.gre_submitted;
	return getBestScore(greScores);
}

export function gmatBestScoreGetter(params: ValueGetterParams): number | null {
	const gmatScores: GmatScore[] = params.data.gmat_submitted;
	return getBestScore(gmatScores);
}

export function lsatBestScoreGetter(params: ValueGetterParams): number | null {
	const lsatScores: LsatScore[] = params.data.lsat_submitted;
	return getBestScore(lsatScores);
}

export function apValueGetter(params: ValueGetterParams): string {
	const apScores: ApScore[] = params.data.ap_submitted;
	return apScores
		.map((ap) => `${ap.subject} (${ap.score})`)
		.sort()
		.join('; ');
}

function ibValueGetter(ibGrades: IbGrade[]): string {
	return ibGrades
		.map((ib) => `${ib.subject} (${ib.grade})`)
		.sort()
		.join('; ');
}

export function ibPredictedValueGetter(params: ValueGetterParams): string {
	return ibValueGetter(params.data.ib_predicted_submitted);
}

export function ibFinalValueGetter(params: ValueGetterParams): string {
	return ibValueGetter(params.data.ib_final_submitted);
}

function alevelValueGetter(alevelGrades: AlevelGrade[]): string {
	return alevelGrades
		.map((al) => `${al.subject} (${al.grade})`)
		.sort()
		.join('; ');
}

export function alevelPredictedValueGetter(params: ValueGetterParams): string {
	return alevelValueGetter(params.data.alevel_predicted_submitted);
}

export function alevelFinalValueGetter(params: ValueGetterParams): string {
	return alevelValueGetter(params.data.alevel_final_submitted);
}

export function deadlineValueGetter(params: ValueGetterParams): Date | null {
	const subTarget: SubTarget = params.data.subtarget;
	if (!subTarget.deadline_date) {
		return null;
	}
	return makeDate(subTarget.deadline_date);
}

export function deadlineValueFormatter(params: ValueFormatterParams): string {
	const subTarget: SubTarget = params.data.subtarget;
	if (!subTarget.deadline_date) {
		return '';
	}
	const dateString = toShortDate(subTarget.deadline_date);
	const timeString = subTarget.deadline_time ? `. ${toTime(subTarget.deadline_time)}` : '';
	const timezone = TIMEZONES_MAP.get(subTarget.deadline_timezone) ?? '';
	return `${dateString}${timeString} ${timezone}`.trim();
}

export function decisionDateValueGetter(params: ValueGetterParams): Date | null {
	const subTarget: SubTarget = params.data.subtarget;
	if (!subTarget.decision_date) {
		return null;
	}
	return makeDate(subTarget.decision_date);
}

export function statusUpdatedValueGetter(params: ValueGetterParams): Date | null {
	const latestLog = params.data.latest_log;
	if (!latestLog) {
		return null;
	}
	return makeDate(params.data.latest_log.updated);
}
