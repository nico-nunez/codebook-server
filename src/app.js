const express = require('express');
const app = express();
const path = require('path');
const { errorHandler, throwError } = require('./utils/error');
const session = require('express-session');
const passport = require('passport');
const { sessionConfig } = require('./config/db');
const helmet = require('helmet');

const authRoutes = require('./routes/auth/auth.router');
const usersRoutes = require('./routes/users/users.router');
const pagesRoutes = require('./routes/pages/pages.router');
const cellsRoutes = require('./routes/cells/cells.router');
const tabsRoutes = require('./routes/tabs/tabs.router');
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
require('./middleware/passport');

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/cells', cellsRoutes);
app.use('/api/tabs', tabsRoutes);

app.get('/', (req, res) => {
	res.send('hello');
});

app.all('*', (req, res, next) => {
	throwError(['Page Not Found'], 404);
});

app.use(errorHandler);

module.exports = app;
