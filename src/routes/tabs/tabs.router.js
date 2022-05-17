const router = require('express').Router({ mergeParams: true });
const tabs = require('./tabs.controller');
const { isLoggedIn, isAuthor } = require('../../middleware/validators');

router
	.route('/:tab_id')
	.get(isLoggedIn, tabs.getTabById)
	.put(isLoggedIn, isAuthor, tabs.updateTabById)
	.delete(isLoggedIn, isAuthor, tabs.deleteTabById);

module.exports = router;
