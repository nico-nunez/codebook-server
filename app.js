const express = require('express');
const app = express();
const { errorHandler } = require('./utils/error');
require('./middleware/passport');

const authRoutes = require('./routes/auth/auth.routes');
const usersRoutes = require('./routes/users/users.routes');
const pagesRoutes = require('./routes/pages/pages.routes');
const cellsRoutes = require('./routes/cells/cells.routes');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/cells', cellsRoutes);

app.get('/', (req, res) => {
	res.send('hello');
});

app.get('*', (req, res) => {
	res.status(404).send('Not Found');
});
app.post('*', (req, res) => {
	res.status(404).send('Not Found');
});

app.use(errorHandler);

module.exports = app;
