const router = require('express').Router();

// @desc All Tabs by Cell ID
// @route GET
router.get('/:id/', (req, res) => {
	res.status(200).send('all tabs');
});

// @desc Update/Insert Tab by ID
// @route PUT
router.put('/:id', (req, res) => {
	res.status(204).send('updated tab');
});

// @desc Delete Tab by ID
// @route DELETE
router.delete('/:id', (req, res) => {
	res.status(204).send('deleted tab');
});

// @desc New Tab ???
// @route POST

// @desc Tab by ID ???
// @route GET

// @desc All Tabs ???
// @route GET

module.exports = router;
