const router = require('express').Router({ mergeParams: true });
const controller = require('./tabs.controller');
const { isLoggedIn, isAuthor } = require('../../middleware/validators');

// router.get('/', isLoggedIn, controller.getAllTabs);

router
	.route('/:tab_id')
	.get(isLoggedIn, controller.getTabById)
	.put(isLoggedIn, isAuthor, controller.updateTabById)
	.delete(isLoggedIn, isAuthor, controller.deleteTabById);

module.exports = router;
