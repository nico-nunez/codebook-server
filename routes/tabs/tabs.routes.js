const router = require('express').Router();
const tabsController = require('./tabs.controller');

// @desc All Tabs
// @route GET
router.get('/', tabsController.getAllTabs);

// @desc Insert Tab
// @route POST
router.post('/', tabsController.insertTab);

// @desc Tab by ID
// @route GET
router.get('/:id', tabsController.getTabById);

// @desc Update Tab by ID
// @route PUT
router.put('/:id', tabsController.updateTabById);

// @desc All Tabs by Cell ID
// @route GET
router.get('/cells/:id', tabsController.getTabsByCellId);

// @desc Delete Tab by ID
// @route DELETE
router.delete('/:id', tabsController.deleteTabById);

module.exports = router;
