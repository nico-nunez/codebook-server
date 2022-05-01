const router = require('express').Router();
const pagesController = require('./pages.controller');
const { validPage } = require('./pages.validators');
const { isAuthor, isLoggedIn } = require('../../middleware/validators');

// @desc All Pages
// @route Public
router.get('/', pagesController.getAllPages);

// @desc Insert New Page
// @route Private
router.post('/', isLoggedIn, validPage, pagesController.insertPage);

// @desc Page by ID (page only)
// @route Public
router.get('/:id', pagesController.getPageByIdMin);

// @desc Page by ID (cells & tabs)
// @route Public
router.get('/:id/full', pagesController.getPageByIdFull);

// @desc All Pages for User by ID
// @route Private
router.get('/users/:id', isLoggedIn, pagesController.getPagesByUser);

// @desc Update Page by ID
// @route Private (strict)
router.put('/:id', isAuthor, validPage, pagesController.updatePageById);

// @desc Delete Page by ID
// @route Private (strict)
router.delete('/:id', isAuthor, pagesController.deletePageById);

module.exports = router;
