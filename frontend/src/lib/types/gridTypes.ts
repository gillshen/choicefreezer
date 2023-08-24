export type SetVisibleParams = {
	headerName: string;
	hide: boolean;
};

export type ColumnControls = Record<string, SetVisibleParams>;
