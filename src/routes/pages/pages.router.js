const router = require('express').Router();
const pages = require('./pages.controller');
const cells = require('../cells/cells.controller');
const { validPage, validPageFull } = require('./pages.validators');
const { validCell, validCellsOrder } = require('../cells/cells.validators');
const { isAuthor, isLoggedIn } = require('../../middleware/validators');

// router.get('/test', pages.test);

router
	.route('/')
	.get(pages.getAllPages)
	.put(isLoggedIn, validPage, pages.upsertPage);

router
	.route('/:page_id')
	.get(pages.getPageById)
	.put(isLoggedIn, isAuthor, validPageFull, pages.upsertFullPage)
	.delete(isLoggedIn, isAuthor, pages.deletePageById);

router
	.route('/:page_id/cells')
	.get(isLoggedIn, cells.getCellsByPageId)
	.post(isLoggedIn, isAuthor, validCell, cells.insertCellByPageId)
	.patch(isLoggedIn, isAuthor, validCellsOrder, cells.updateCellsOrder);

module.exports = router;
