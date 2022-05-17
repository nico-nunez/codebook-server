const router = require('express').Router();
const cells = require('./cells.controller');
const tabs = require('../tabs/tabs.controller');
const { validCellUpdate } = require('./cells.validators');
const { isAuthor, isLoggedIn } = require('../../middleware/validators');
const { validTab, validTabsOrder } = require('../tabs/tabs.validators');

router
	.route('/:cell_id')
	.get(isLoggedIn, cells.getCellById)
	.put(isLoggedIn, isAuthor, validCellUpdate, cells.updateCellById)
	.delete(isLoggedIn, isAuthor, cells.deleteCellById);

router
	.route('/:cell_id/tabs')
	.get(isLoggedIn, tabs.getAllTabsByCellId)
	.post(isLoggedIn, isAuthor, validTab, tabs.insertTabByCellId)
	.put(isLoggedIn, isAuthor, validTabsOrder, tabs.updateTabsOrderByCellId);

module.exports = router;
