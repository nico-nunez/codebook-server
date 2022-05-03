const router = require('express').Router({ mergeParams: true });
const controller = require('./tabs.controller');
const { isLoggedIn, isAuthor } = require('../../middleware/validators');

// router.get('/', isLoggedIn, controller.getAllTabs);

router
	.route('/:tab_id')
	.get(isLoggedIn, controller.getTabById)
	.put(isAuthor, controller.updateTabById)
	.delete(isAuthor, controller.deleteTabById);

module.exports = router;
