const { catchAsync, throwError } = require('../../utils/error');
const models = require('../../models/models');
const { pagination } = require('../../utils/utils');

module.exports.getAllTabs = catchAsync(async (req, res, next) => {
	const { page, limit, offset } = pagination(req.query.page, req.query.limit);
	const tabs = await models.findAll('tabs', { limit, offset });
	res.status(200).json({ tabs, details: { page, limit } });
});

module.exports.getTabById = catchAsync(async (req, res, next) => {
	const { tab_id = null } = req.params;
	const tab = await models.findOneById('tabs', tab_id);
	res.status(200).json(tab);
});

module.exports.updateTabById = catchAsync(async (req, res, next) => {
	const { tab_id } = req.params;
	const { code_language, content } = req.body;
	await models.updateOneById('tabs', tab_id, { code_language, content });
	res.status(204).json();
});

module.exports.deleteTabById = catchAsync(async (req, res, next) => {
	const { tab_id } = req.params;
	await models.deleteOneById('tabs', tab_id);
	res.status(204).json({});
});
