const router = require('express').Router();
const pagesController = require('./pages.controller');
const { validPage } = require('./pages.validators');

// @desc All Pages
// @route Public
router.get('/', pagesController.getAllPages);

// @desc Insert New Page
// @route Private
router.post('/', validPage, pagesController.insertPage);

// @desc Page by ID (page only)
// @route Public??
router.get('/:id', pagesController.getPageByIdMin);

// @desc Page by ID (cells & tabs)
// @route Private??
router.get('/:id/full', pagesController.getPageByIdFull);

// @desc All Pages for User by ID
// @route Private??
router.get('/users/:id', pagesController.getPagesByUser);

// @desc Update Page by ID
// @route Private
router.put('/:id', validPage, pagesController.updatePageById);

// @desc Delete Page by ID
// @route Private
router.delete('/:id', pagesController.deletePageById);

module.exports = router;
