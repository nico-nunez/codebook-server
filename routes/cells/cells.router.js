const router = require('express').Router();
const { isAuthor, isLoggedIn } = require('../../middleware/validators');
const controller = require('./cells.controller');
const { validTab, validTabsOrder } = require('../tabs/tabs.validators');
const { validCellUpdate } = require('./cells.validators');

// router.get('/', isLoggedIn, controller.getAllCells);

router
	.route('/:cell_id')
	.get(isLoggedIn, controller.getCellById)
	.put(isAuthor, validCellUpdate, controller.updateCellById)
	.delete(isAuthor, controller.deleteCellById);

router
	.route('/:cell_id/tabs')
	.get(isLoggedIn, controller.getAllTabsByCellId)
	.post(isAuthor, validTab, controller.insertTabByCellId)
	.put(isAuthor, validTabsOrder, controller.updateTabsOrderByCellId);

module.exports = router;
