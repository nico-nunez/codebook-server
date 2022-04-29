const router = require('express').Router();
const pagesController = require('./pages.controller');

// @desc All Pages
// @route GET
router.get('/', pagesController.getAllPages);

// @desc Page by ID (page only)
// @route GET
router.get('/:id/min', pagesController.getPageById);

// @desc Page by ID (include cells & tabs)
// @route GET
router.get('/:id', pagesController.getPageById);

// @desc All Pages for User by ID
// @route GET
router.get('/users/:id', (req, res) => {
	res.status(200).send('users pages');
});

// @desc Update/Insert Page by ID
// @route PUT
router.put('/:id', (req, res) => {
	console.log(req.body);
	res.status(201).send('updated/created page');
});

// @desc Delete Page by ID
// @route DELETE
router.delete('/:id', (req, res) => {
	res.status(204).send('deleted');
});

// @desc New Page ???
// @route POST

module.exports = router;
