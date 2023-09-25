import { z } from 'zod';
import { THIS_YEAR } from './utils/dateUtils';

const safeForHtml = (value: string) => !/[<>&"]/.test(value);
const beSafeForHtml = { message: 'Characters <, >, &, and " are not allowed' };

const fieldRequired = { message: 'This field is required' };
const selectionRequired = { message: 'Select an option' };

const minValueExceeded = (minValue: number) => ({ message: `Minimum value ${minValue}` });
const maxValueExceeded = (maxValue: number) => ({ message: `Maximum value ${maxValue}` });

const maxLengthExceeded = (maxLength: number) => ({
	message: `${maxLength}-character limit exceeded`
});

const valueOutOfStep = (step: number) => ({
	message: step === 1 ? 'Must be an integer' : `Must be multiples of ${step}`
});

export const idValidator = { id: z.number().min(1) };
export const optionalIdValidator = { id: z.number().min(1).optional().nullable() };

// School creation/update form
export const newSchoolValidators = {
	name: z.string().trim().min(1, fieldRequired).max(100, maxLengthExceeded(100)),
	abbreviation: z.string().trim().max(20, maxLengthExceeded(20)).default(''),
	type: z.string().min(1, selectionRequired),
	country: z.string().min(1, selectionRequired),

	// Creation form only:
	ugFreshmanRelevant: z.boolean().default(false),
	ugTransferRelevant: z.boolean().default(false)
};

// Program update form
export const programUpdateValidators = {
	...idValidator,
	name: z.string().trim().max(100, maxLengthExceeded(100)).default(''),
	degree: z.string().trim().max(100, maxLengthExceeded(100)).default('')
};

// Student & contract creation form
export const studentLegalNameValidators = {
	last_name: z
		.string()
		.trim()
		.min(1, fieldRequired)
		.max(50, maxLengthExceeded(50))
		.refine(safeForHtml, beSafeForHtml),
	first_name: z
		.string()
		.trim()
		.min(1, fieldRequired)
		.max(50, maxLengthExceeded(50))
		.refine(safeForHtml, beSafeForHtml),
	last_name_first: z.boolean().default(true)
};

export const studentRomanizedNameValidators = {
	last_name_romanized: z
		.string()
		.trim()
		.min(1, fieldRequired)
		.max(50, maxLengthExceeded(50))
		.refine(safeForHtml, beSafeForHtml),
	first_name_romanized: z
		.string()
		.trim()
		.min(1, fieldRequired)
		.max(50, maxLengthExceeded(50))
		.refine(safeForHtml, beSafeForHtml)
};

export const studentGenderValidator = { gender: z.string().min(1, selectionRequired) };

export const studentCitizenshipValidator = { citizenship: z.string().min(1).default('China') };

export const studentDateOfBirthValidator = { date_of_birth: z.string().nullable() };

export const studentResidenceValidators = {
	city: z.string().trim().max(100, maxLengthExceeded(100)).refine(safeForHtml, beSafeForHtml),
	state: z.string().trim().refine(safeForHtml, beSafeForHtml)
};

export const studentCommentsValidator = {
	comments: z.string().trim().max(1000, maxLengthExceeded(1000)).default('')
};

export const studentValidators = {
	...studentLegalNameValidators,
	...studentRomanizedNameValidators,
	...studentGenderValidator,
	...studentCitizenshipValidator,
	...studentDateOfBirthValidator,
	...studentResidenceValidators,
	...studentCommentsValidator
};

const contractValidators = {
	type: z.string().min(1, selectionRequired),
	target_year: z
		.number()
		.positive(selectionRequired)
		.default(THIS_YEAR + 1),
	date_signed: z.string().nullable(),
	student_progression_at_signing: z.string().trim(),
	status: z.string().min(1, selectionRequired)
};

export const contractUpdateValidators = {
	...idValidator,
	...contractValidators
};

export const contractServiceValidators = {
	...contractValidators,

	// Service fields
	cf_planner: z.number().positive(selectionRequired),
	cf_asst_planner: z.number().nullable(),
	cf_strat_planner: z.number().nullable(),

	cf_essay_advisor_1: z.number().positive(selectionRequired),
	cf_essay_advisor_2: z.number().nullable()
};

// Service creation/update form
export const serviceValidators = {
	id: optionalIdValidator.id,
	contract: idValidator.id,
	cf_person: z.number().min(1, selectionRequired),
	role: z.string().min(1, selectionRequired),
	start_date: z.string().nullable(),
	end_date: z.string().nullable()
};

// Application creation form
export const applicationValidators = {
	studentId: idValidator.id,

	schoolId: z.number().positive(selectionRequired),

	/* The second school id is required for a joint program but
	 * optional otherwise. Forms should set it to a negative value
	 * by default when it is required, and default to 0 if not. */
	secondSchoolId: z.number().nonnegative(selectionRequired),

	programType: z.string().min(1, selectionRequired),

	/* The program id is not required when the user explicitly
	 * indicates that they want a new program created, which forms
	 * should represent by setting the value to 0. The default value
	 * should be negative to trigger the validation error. */
	programId: z.number().nonnegative(selectionRequired),

	programName: z.string().trim().max(100, maxLengthExceeded(100)).default(''),
	programDegree: z.string().trim().max(100, maxLengthExceeded(100)).default(''),

	year: z
		.number()
		.positive(selectionRequired)
		.default(THIS_YEAR + 1),
	term: z.string().min(1, selectionRequired),
	admissionPlan: z.string().min(1, selectionRequired),

	firstMajor: z.string().trim().max(100, maxLengthExceeded(100)).nullable(),
	firstMajorCategory: z.string().trim().max(100, maxLengthExceeded(100)).default(''),
	secondMajor: z.string().trim().max(100, maxLengthExceeded(100)).nullable(),
	secondMajorCategory: z.string().trim().max(100, maxLengthExceeded(100)).default(''),
	thirdMajor: z.string().trim().max(100, maxLengthExceeded(100)).nullable(),
	thirdMajorCategory: z.string().trim().max(100, maxLengthExceeded(100)).default('')
};

// Application update form
export const admissionPlanUpdateValidators = {
	targetId: idValidator.id,
	admissionPlan: z.string().min(1, selectionRequired)
};

export const majorChoicesUpdateValidators = {
	firstMajorId: optionalIdValidator.id,
	firstMajor: z.string().trim().max(100, maxLengthExceeded(100)).nullable(),
	firstMajorCategory: z.string().trim().max(100, maxLengthExceeded(100)).default(''),

	secondMajorId: optionalIdValidator.id,
	secondMajor: z.string().trim().max(100, maxLengthExceeded(100)).nullable(),
	secondMajorCategory: z.string().trim().max(100, maxLengthExceeded(100)).default(''),

	thirdMajorId: optionalIdValidator.id,
	thirdMajor: z.string().trim().max(100, maxLengthExceeded(100)).nullable(),
	thirdMajorCategory: z.string().trim().max(100, maxLengthExceeded(100)).default('')
};

export const scholarshipUpdateValidators = {
	scholarshipAmount: z.number().int().min(1, minValueExceeded(1)).optional().nullable(),
	scholarshipCurrency: z.string().optional().default('USD')
};

// Application log creation form
export const applicationLogValidators = {
	application: idValidator.id,
	status: z.string().min(1, selectionRequired),
	date: z.string().min(1, fieldRequired),
	comments: z.string().trim().max(1000, maxLengthExceeded(1000)).default(''),
	// Extra info in the event of admission
	altAdmittedTarget: z.number().optional().nullable(),
	...scholarshipUpdateValidators
};

// Deadline update form
export const deadlineValidators = {
	id: idValidator.id, // subtarget id
	deadline_date: z.string().optional().nullable(),
	deadline_time: z.string().optional().nullable(),
	deadline_timezone: z.string().trim().default('')
};

// Decision date update form
export const decisionDateValidators = {
	id: idValidator.id, // subtarget id
	decision_date: z.string().optional().nullable()
};

// Subtarget update form
export const subTargetValidators = {
	...deadlineValidators,
	...decisionDateValidators,
	id: optionalIdValidator.id,
	target: idValidator.id,
	admission_plan: z.string().min(1, selectionRequired),
	comments: z.string().trim().default('')
};

// User log creation/update form
export const userLogValidators = {
	author: z.number().min(1), // user id
	date: z.string().min(1, fieldRequired),
	title: z.string().trim().max(100, maxLengthExceeded(100)).default(''),
	text: z.string().trim().min(1, fieldRequired).max(1000, maxLengthExceeded(1000)),
	pinned: z.boolean().default(false),
	shared: z.boolean().default(false),
	task_status: z.string().optional().default(''),
	task_due: z.string().optional().nullable(),
	relevant_student: z.number().min(1).nullable(),

	// used internally
	isTodo: z.boolean()
};

// Enrollment creation/update form
export const enrollmentValidators = {
	id: optionalIdValidator.id,
	student: z.number().min(1), // student id
	school: z.number().min(1, selectionRequired), // school id
	program_type: z.string().min(1, selectionRequired),
	starting_progression: z.string().min(1, selectionRequired),
	start_date: z.string().min(1, fieldRequired),
	ending_progression: z.string().optional().default(''),
	end_date: z.string().nullable(),
	curriculum: z.string().trim().default(''),
	majors: z.string().trim().max(100, maxLengthExceeded(100)).default('')
};

// GPA creation/update form
export const gpaValidators = {
	id: optionalIdValidator.id,
	enrollment: idValidator.id,
	progression: z.string().min(1, selectionRequired),
	term: z.string().min(1, selectionRequired),
	value: z.number().min(0, minValueExceeded(0)),
	scale: z.number().min(0, minValueExceeded(0)).default(4.0),
	is_cumulative: z.boolean().default(false)
};

// Class rank creation/update form
export const classRankValidators = {
	id: optionalIdValidator.id,
	enrollment: idValidator.id,
	progression: z.string().min(1, selectionRequired),
	term: z.string().min(1, selectionRequired),
	class_size: z.number().int().min(1, minValueExceeded(1)).optional().nullable(),
	rank: z.number().int().min(1, minValueExceeded(1)).optional().nullable(),
	top_x: z
		.number()
		.int()
		.min(0, minValueExceeded(0))
		.max(100, maxValueExceeded(100))
		.optional()
		.nullable()
};

// Base test score validators
const testScoreValidators = {
	id: optionalIdValidator.id,
	student: idValidator.id,
	date: z.string().nullable(),
	comments: z.string().trim().max(1000, maxLengthExceeded(1000)).default('')
};

// TOEFL creation/update form
export const toeflScoreValidators = {
	...testScoreValidators,
	reading: z.number().int().min(0, minValueExceeded(0)).max(30, maxValueExceeded(30)).nullable(),
	listening: z.number().int().min(0, minValueExceeded(0)).max(30, maxValueExceeded(30)).nullable(),
	speaking: z.number().int().min(0, minValueExceeded(0)).max(30, maxValueExceeded(30)).nullable(),
	writing: z.number().int().min(0, minValueExceeded(0)).max(30, maxValueExceeded(30)).nullable()
};

// ILETS creation/update form
export const ieltsScoreValidators = {
	...testScoreValidators,
	listening: z
		.number()
		.min(0, minValueExceeded(0))
		.max(9, maxValueExceeded(9))
		.step(0.5, valueOutOfStep(0.5))
		.nullable(),
	reading: z
		.number()
		.min(0, minValueExceeded(0))
		.max(9, maxValueExceeded(9))
		.step(0.5, valueOutOfStep(0.5))
		.nullable(),
	writing: z
		.number()
		.min(0, minValueExceeded(0))
		.max(9, maxValueExceeded(9))
		.step(0.5, valueOutOfStep(0.5))
		.nullable(),
	speaking: z
		.number()
		.min(0, minValueExceeded(0))
		.max(9, maxValueExceeded(9))
		.step(0.5, valueOutOfStep(0.5))
		.nullable()
};

// DET creation/update form
export const detScoreValidators = {
	...testScoreValidators,
	overall: z
		.number()
		.int()
		.min(10, minValueExceeded(10))
		.max(160, maxValueExceeded(160))
		.step(5, valueOutOfStep(5))
		.nullable(),
	literacy: z
		.number()
		.int()
		.min(10, minValueExceeded(10))
		.max(160, maxValueExceeded(160))
		.step(5, valueOutOfStep(5))
		.nullable(),
	comprehension: z
		.number()
		.int()
		.min(10, minValueExceeded(10))
		.max(160, maxValueExceeded(160))
		.step(5, valueOutOfStep(5))
		.nullable(),
	conversation: z
		.number()
		.int()
		.min(10, minValueExceeded(10))
		.max(160, maxValueExceeded(160))
		.step(5, valueOutOfStep(5))
		.nullable(),
	production: z
		.number()
		.int()
		.min(10, minValueExceeded(10))
		.max(160, maxValueExceeded(160))
		.step(5, valueOutOfStep(5))
		.nullable()
};

// SAT creation/update form
export const satScoreValidators = {
	...testScoreValidators,
	ebrw: z
		.number()
		.int()
		.min(200, minValueExceeded(200))
		.max(800, maxValueExceeded(800))
		.step(10, valueOutOfStep(10))
		.nullable(),
	math: z
		.number()
		.int()
		.min(200, minValueExceeded(200))
		.max(800, maxValueExceeded(800))
		.step(10, valueOutOfStep(10))
		.nullable()
};

// ACT creation/update form
export const actScoreValidators = {
	...testScoreValidators,
	english: z.number().int().min(1, minValueExceeded(1)).max(36, maxValueExceeded(36)).nullable(),
	math: z.number().int().min(1, minValueExceeded(1)).max(36, maxValueExceeded(36)).nullable(),
	reading: z.number().int().min(1, minValueExceeded(1)).max(36, maxValueExceeded(36)).nullable(),
	science: z.number().int().min(1, minValueExceeded(1)).max(36, maxValueExceeded(36)).nullable(),
	writing: z.number().int().min(2, minValueExceeded(2)).max(12, maxValueExceeded(12)).nullable()
};

// AP creation/update form
export const apScoreValidators = {
	...testScoreValidators,
	subject: z.string().min(1, fieldRequired),
	score: z.number().int().min(1, minValueExceeded(1)).max(5, maxValueExceeded(5)).nullable()
};

// IB creation/update form
export const ibGradeValidators = {
	...testScoreValidators,
	subject: z.string().min(1, fieldRequired),
	grade: z.number().int().min(1, minValueExceeded(1)).max(7, maxValueExceeded(7)).nullable()
};

// A-level creation/update form
export const alevelGradeValidators = {
	...testScoreValidators,
	subject: z.string().min(1, fieldRequired),
	percentage: z.number().min(0, minValueExceeded(0)).max(100, maxValueExceeded(100)).nullable(),
	grade: z.string().nullable()
};

// GRE creation/update form
export const greScoreValidators = {
	...testScoreValidators,
	verbal: z
		.number()
		.int()
		.min(130, minValueExceeded(130))
		.max(170, maxValueExceeded(170))
		.nullable(),
	quant: z
		.number()
		.int()
		.min(130, minValueExceeded(130))
		.max(170, maxValueExceeded(170))
		.nullable(),
	writing: z
		.number()
		.min(0, minValueExceeded(0))
		.max(6, maxValueExceeded(6))
		.step(0.5, valueOutOfStep(0.5))
		.nullable()
};

// GMAT creation/update form
export const gmatScoreValidators = {
	...testScoreValidators,
	total: z
		.number()
		.int()
		.min(200, minValueExceeded(200))
		.max(800, maxValueExceeded(800))
		.step(10, valueOutOfStep(10))
		.nullable(),
	verbal: z.number().int().min(0, minValueExceeded(0)).max(60, maxValueExceeded(60)).nullable(),
	quant: z.number().int().min(0, minValueExceeded(0)).max(60, maxValueExceeded(60)).nullable(),
	reasoning: z.number().int().min(1, minValueExceeded(1)).max(8, maxValueExceeded(8)).nullable(),
	writing: z.number().int().min(0, minValueExceeded(0)).max(6, maxValueExceeded(6)).nullable()
};

// LSAT creation/update form
export const lsatScoreValidators = {
	...testScoreValidators,
	total: z.number().int().min(120, minValueExceeded(120)).max(180, maxValueExceeded(180)).nullable()
};

// Target subject rank update form
export const cfRankValidators = {
	id: idValidator.id, // target id
	cf_rank: z.number().int().min(1, minValueExceeded(1)).nullable()
};
