export const defaultColDef = {
	sortable: true,
	resizable: true,
	flex: 1,
	minWidth: 100,
	maxWidth: 500,
	filter: 'agTextColumnFilter'
};

export const columnTypes = {
	numberColumn: {
		cellDataType: 'number',
		filter: 'agNumberColumnFilter'
	},

	dateStringColumn: {
		cellDataType: 'dateString',
		filter: 'agDateColumnFilter'
	}
};
