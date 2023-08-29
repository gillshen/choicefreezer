const timezones: [string, string][] = [
	['(local)', '(local)'],
	// US/Canada eastern
	['Eastern Standard Time (UTC-05:00)', 'UTC-05:00'],
	['Eastern Daylight Time (UTC-04:00)', 'UTC-04:00'],
	['Eastern Time (UTC-05:00/4:00)', 'Eastern Time'],
	// US/Canada pacific
	['Pacific Standard Time (UTC-08:00)', 'UTC-08:00'],
	['Pacific Daylight Time (UTC-07:00)', 'UTC-07:00'],
	['Pacific Time (UTC-08:00/07:00)', 'Pacific Time'],
	// US/Canada central
	['Central Standard Time (UTC-06:00)', 'UTC-06:00'],
	['Central Daylight Time (UTC-05:00)', 'UTC-05:00'],
	['Central Time (UTC-06:00/05:00)', 'Central Time'],
	// UK
	['Greenwich Mean Time (UTC+00:00)', 'UTC+00:00'],
	['British Summer Time (UTC+01:00)', 'UTC+01:00'],
	// Hong Kong
	['Hong Kong Time (UTC+08:00)', 'UTC+08:00'],
	// Australia
	['Australian Eastern Standard Time (UTC+10:00)', 'UTC+10:00'],
	['Australian Eastern Daylight Time (UTC+11:00)', 'UTC+11:00'],
	// rest
	['UTC+12:00', 'UTC+12:00'],
	['UTC+11:00', 'UTC+11:00'],
	['UTC+10:00', 'UTC+10:00'],
	['UTC+09:00', 'UTC+09:00'],
	['UTC+08:00', 'UTC+08:00'],
	['UTC+07:00', 'UTC+07:00'],
	['UTC+06:00', 'UTC+06:00'],
	['UTC+05:00', 'UTC+05:00'],
	['UTC+04:00', 'UTC+04:00'],
	['UTC+03:00', 'UTC+03:00'],
	['UTC+02:00', 'UTC+02:00'],
	['UTC+01:00', 'UTC+01:00'],
	['UTC+00:00', 'UTC+00:00'],
	['UTC-01:00', 'UTC-01:00'],
	['UTC-02:00', 'UTC-02:00'],
	['UTC-03:00', 'UTC-03:00'],
	['UTC-04:00', 'UTC-04:00'],
	['UTC-05:00', 'UTC-05:00'],
	['UTC-06:00', 'UTC-06:00'],
	['UTC-07:00', 'UTC-07:00'],
	['UTC-08:00', 'UTC-08:00'],
	['UTC-09:00', 'UTC-09:00'],
	['UTC-10:00', 'UTC-10:00'],
	['UTC-11:00', 'UTC-11:00'],
	['UTC-12:00', 'UTC-12:00']
];

export const TIMEZONES: string[] = timezones.map(([tz]) => tz);

export const TIMEZONES_MAP = new Map(timezones);
