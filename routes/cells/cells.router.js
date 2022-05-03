const router = require('express').Router();
const { isAuthor, isLoggedIn } = require('../../middleware/validators');
const controller = require('./cells.controller');
const { validTab, validTabsOrder } = require('../tabs/tabs.validators');
const { validCellUpdate } = require('./cells.validators');

// router.get('/', isLoggedIn, controller.getAllCells);

router
	.route('/:cell_id')
	.get(isLoggedIn, controller.getCellById)
	.put(isLoggedIn, isAuthor, validCellUpdate, controller.updateCellById)
	.delete(isLoggedIn, isAuthor, controller.deleteCellById);

router
	.route('/:cell_id/tabs')
	.get(isLoggedIn, controller.getAllTabsByCellId)
	.post(isLoggedIn, isAuthor, validTab, controller.insertTabByCellId)
	.put(
		isLoggedIn,
		isAuthor,
		validTabsOrder,
		controller.updateTabsOrderByCellId
	);

module.exports = router;
