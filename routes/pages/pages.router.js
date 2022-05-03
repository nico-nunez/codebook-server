const router = require('express').Router();
const controller = require('./pages.controller');
const { validPage } = require('./pages.validators');
const { validCell, validCellsOrder } = require('../cells/cells.validators');
const { isAuthor, isLoggedIn } = require('../../middleware/validators');

router
	.route('/')
	.get(controller.getAllPages)
	.post(isLoggedIn, validPage, controller.insertPage);

router
	.route('/:page_id')
	.get(controller.getPageById)
	.put(isAuthor, validPage, controller.updatePageById)
	.delete(isAuthor, controller.deletePageById);

router
	.route('/:page_id/cells')
	.get(isLoggedIn, controller.getCellsByPageId)
	.post(isAuthor, validCell, controller.insertCellByPageId)
	.put(isAuthor, validCellsOrder, controller.updateCellsOrder);

module.exports = router;
