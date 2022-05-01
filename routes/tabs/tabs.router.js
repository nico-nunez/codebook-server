const router = require('express').Router();
const tabsController = require('./tabs.controller');
const { validTab, validTabsOrder } = require('./tabs.validators');
const { isLoggedIn, isAuthor } = require('../../middleware/validators');

// @desc All Tabs??
// @route Private
router.get('/', isLoggedIn, tabsController.getAllTabs);

// @desc Insert Tab by Cell id
// @route Private (strict)
router.post('/cells/:id', isAuthor, validTab, tabsController.insertTab);

// @desc Tab by ID
// @route Private
router.get('/:id', isLoggedIn, tabsController.getTabById);

// @desc All Tabs by Cell ID
// @route Public
router.get('/cells/:id', tabsController.getTabsByCellId);

// @desc Update Tabs order by cell ID
// @route Private (strict)
router.put(
	'/cells/:id',
	isAuthor,
	validTabsOrder,
	tabsController.updateTabsOrderByCellId
);

// @desc Delete Tab by ID
// @route Private (strict)
router.delete('/:id', isAuthor, tabsController.deleteTabById);

module.exports = router;
