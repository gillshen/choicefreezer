const recognized_tests = [
	'TOEFL',
	'IELTS',
	'DET',
	'SAT',
	'ACT',
	'AP',
	'IB (final)',
	'IB (predicted)',
	'A-Level',
	'GRE',
	'GMAT',
	'LSAT'
].sort();

export const RECOGNIZED_TESTS = [...recognized_tests] as const;
