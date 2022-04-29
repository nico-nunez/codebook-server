const router = require('express').Router();

// @desc All Cells by Page ID
// @route GET
router.get('/pages/:id', (req, res) => {
	res.status(200).send('all page cells');
});

// @desc Update/Insert Cell by ID
// @route PUT
router.put('/:id', (req, res) => {
	res.status(204).send('updated cell');
});

// @desc Delete Cell by ID
// @route DELETE
router.delete('/:id', (req, res) => {
	res.status(204).send('deleted cell');
});

module.exports = router;

// @desc All Cells ???
// @route GET

// @desc New Cell ???
// @route POST

// @desc Cell by ID ???
// @route GET
