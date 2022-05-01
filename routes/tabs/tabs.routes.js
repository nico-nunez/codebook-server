const router = require('express').Router();
const tabsController = require('./tabs.controller');
const { validTab, validTabsOrder } = require('./tabs.validators');

// @desc All Tabs
// @route GET
router.get('/', tabsController.getAllTabs);

// @desc Insert Tab by Cell id
// @route POST
router.post('/cells/:id', validTab, tabsController.insertTab);

// @desc Tab by ID
// @route GET
router.get('/:id', tabsController.getTabById);

// @desc All Tabs by Cell ID
// @route GET
router.get('/cells/:id', tabsController.getTabsByCellId);

// @desc Update Tabs order by cell ID
// @route PUT
router.put(
	'/cells/:id',
	validTabsOrder,
	tabsController.updateTabsOrderByCellId
);

// @desc Delete Tab by ID
// @route DELETE
router.delete('/:id', tabsController.deleteTabById);

module.exports = router;
