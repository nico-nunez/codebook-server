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
	.put(isLoggedIn, isAuthor, validPage, controller.updateFullPageById)
	.patch(isLoggedIn, isAuthor, validPage, controller.updatePageById)
	.delete(isLoggedIn, isAuthor, controller.deletePageById);

router
	.route('/:page_id/cells')
	.get(isLoggedIn, controller.getCellsByPageId)
	.post(isLoggedIn, isAuthor, validCell, controller.insertCellByPageId)
	.put(isLoggedIn, isAuthor, validCellsOrder, controller.updateCellsOrder);

module.exports = router;
