const router = require('express').Router();
const pagesController = require('./pages.controller');

// @desc All Pages
// @route GET
router.get('/', pagesController.getAllPages);

// @desc Insert New Page
// @route POST
router.post('/', pagesController.insertPage);

// @desc Page by ID (page only)
// @route GET
router.get('/:id', pagesController.getPageByIdMin);

// @desc Page by ID (include cells & tabs)
// @route GET
router.get('/:id/full', pagesController.getPageByIdFull);

// @desc All Pages for User by ID
// @route GET
router.get('/users/:id', pagesController.getPagesByUser);

// @desc Update Page by ID
// @route PUT
router.put('/:id', pagesController.updatePageById);

// @desc Delete Page by ID
// @route DELETE
router.delete('/:id', pagesController.deletePageById);

module.exports = router;
