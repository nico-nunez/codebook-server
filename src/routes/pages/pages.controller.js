const { db } = require('../../config/db');
const { catchAsync, throwError } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

// GET ALL PAGES
module.exports.getAllPages = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const pages = await models.findAllPages({ limit, offset });
	res.status(200).json({ pages, pagination: { page, limit } });
});

// GET FULL PAGE BY ID
module.exports.getPageById = catchAsync(async (req, res, next) => {
	const { page_id = null } = req.params;
	if (!page_id) throwError('"Page" id required');
	const fullPage = await getFullPage(page_id);
	res.status(200).json(fullPage);
});

// UPSERT PAGE ONLY
module.exports.upsertPage = catchAsync(async (req, res, next) => {
	const page = { ...req.body };
	page.user_id = page.user_id || req.user.id;
	const { savedPage, status } = await upsertPage(page);
	res.status(status).json(savedPage);
});

// UPSERT FULL PAGE
module.exports.upsertFullPage = catchAsync(async (req, res, next) => {
	const { page, cells, tabs } = req.body;
	page.user_id = page.user_id || req.user.id;
	const { savedPage, status: pageStatus } = await upsertPage(page);
	if (!savedPage.id) throwError('Something went wrong', 500);
	const { savedCells, status: cellsStatus } = await upsertCells(
		savedPage.id,
		cells
	);
	savedCells.sort((a, b) => a.order_index - b.order_index);
	const index = savedCells.findIndex((cell) => cell.cell_type === 'code');
	if (tabs.length && index < 0) throwError('"Code Cell" required.', 400);
	const cell_id = savedCells[index].id;
	const { savedTabs, status: tabsStatus } = await upsertTabs(cell_id, tabs);
	savedTabs.sort((a, b) => a.order_index - b.order_index);
	const resStatus = Math.max(pageStatus, cellsStatus, tabsStatus);
	res
		.status(resStatus)
		.json({ page: savedPage, cells: savedCells, tabs: savedTabs });
});

// UPDATE PAGE ONLY BY ID
module.exports.updatePageById = catchAsync(async (req, res, next) => {
	const { page_id } = req.params;
	await models.updateOneById('pages', page_id, req.body);
	res.status(204).json({});
});

// DELETE PAGE BY ID
module.exports.deletePageById = catchAsync(async (req, res, next) => {
	const { page_id } = req.params;
	await models.deleteOneById('pages', page_id);
	res.status(204).json({});
});

// USERS ROUTE
module.exports.getPagesByUserId = catchAsync(async (req, res, next) => {
	const { user_id = null } = req.params;
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const user = await models.findOneById('users', user_id);
	if (!user) throwError(['User not found.'], 404);
	const pages = await models.findAllPagesByUserId(user.id, { limit, offset });
	res.status(200).json({ pages, pagination: { limit, offset } });
});

//=====================================
const getFullPage = async (page_id) => {
	const page = await models.findOneById('pages', page_id);
	if (!page) throwError(['"page" does not exist'], 404);
	const cells = await models.findManyByColumns('cells', {
		page_id,
	});
	cells.sort((a, b) => a.order_index - b.order_index);
	const cellIds = cells.length ? cells.map((cell) => cell.id) : null;
	const tabsQuery =
		'SELECT * FROM tabs WHERE cell_id IN (?) ORDER BY order_index';
	const [tabs, fields] = await db.query(tabsQuery, [cellIds]);
	tabs.sort((a, b) => a.order_index - b.order_index);
	return { page, cells, tabs };
};

const upsertPage = async (page) => {
	let status = 200;
	if (typeof page.id === 'string') {
		status = 201;
		page.id = null;
	} else {
		page.updated_at = new Date().toISOString();
	}
	const page_id = await models.upsertOne('pages', page);
	const savedPage = await models.findOneById('pages', page_id);
	return { savedPage, status };
};

const upsertCells = async (page_id, cells) => {
	let status = 200;
	if (!cells.length) return { savedCells: [], status };
	const preppedCells = cells.map((cell, i) => {
		if (typeof cell.id === 'string') {
			cell.id = null;
			status = 201;
		} else {
			cell.updated_at = new Date().toISOString();
		}
		cell.page_id = page_id;
		cell.order_index = i;
		return cell;
	});
	await models.upsertMany('cells', preppedCells);
	const savedCells = await models.findManyByColumns('cells', { page_id });
	return { savedCells, status };
};

const upsertTabs = async (cell_id, tabs) => {
	let status = 200;
	if (!tabs.length) return { savedTabs: [], status };
	const preppedTabs = tabs.map((tab, i) => {
		if (typeof tab.id === 'string') {
			tab.id = null;
			status = 201;
		} else {
			tab.updated_at = new Date().toISOString();
		}
		tab.cell_id = cell_id;
		tab.order_index = i;
		return tab;
	});
	await models.upsertMany('tabs', preppedTabs);
	const savedTabs = await models.findManyByColumns('tabs', { cell_id });
	return { savedTabs, status };
};

// module.exports.test = catchAsync(async (req, res, next) => {
// 	const { page, cells, tabs } = testPage;
// 	page.id = typeof page.id === 'number' ? page.id : null;
// 	const page_id = (await models.upsertOne('pages', page)) || page.id;
// 	if (!page_id) throwError('"Page" does not exist', 404);
// 	if (cells) await upsertCells(page_id, cells);
// 	if (tabs) await upsertTabs(page_id, tabs);
// 	const fullPage = await getFullPage(page_id);
// 	res.status(200).json(fullPage);
// });

// module.exports.insertPage = catchAsync(async (req, res, next) => {
// 	const { page_name, cells, tabs } = req.body;
// 	const user_id = req.user.id;
// 	let insertedCellIds, insertedTabIds;
// 	const page = await models.insertOne('pages', {
// 		page_name,
// 		user_id,
// 		author: req.user.profile_name,
// 	});
// 	if (!page) throwError('page does not exist', 404);
// 	if (cells && cells.length > 0) {
// 		const modifiedCells = cells.map((cell) => {
// 			const { cell_type, content } = { ...cell };
// 			return { cell_type, content, page_id: page.id };
// 		});
// 		insertedCellIds = await models.insertMany('cells', modifiedCells);
// 	}
// 	if (tabs && tabs.length > 0) {
// 		const index = cells.findIndex((cell) => cell.cell_type === 'code');
// 		if (index < 0) throwError('code cell does not exist', 404);
// 		const modifiedTabs = tabs.map((tab) => {
// 			const { code_language, content } = { ...tab };
// 			return { code_language, content, cell_id: insertedCellIds[index] };
// 		});
// 		await models.insertMany('tabs', modifiedTabs);
// 	}
// 	res.status(201).json(page);
// });

// module.exports.updateFullPageById = catchAsync(async (req, res, next) => {
// 	const { page_id } = req.params;
// 	const { page_name, cells, tabs } = req.body;
// 	await models.updateOneById('pages', page_id, { page_name });
// 	cells.forEach(
// 		async (cell) => await models.updateOneById('cells', id, { content })
// 	);
// 	tabs.forEach(
// 		async ({ id, content }) =>
// 			await models.updateOneById('tabs', id, { content })
// 	);
// 	res.status(204).json();
// });
