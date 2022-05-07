const passport = require('passport');
const router = require('express').Router();
const controller = require('./auth.controller');
const { isLoggedIn } = require('../../middleware/validators');
const { validRegistration, validLogin } = require('./auth.validators');

const CLIENT_HOMEPAGE = 'http://localhost:3000';

// @desc: Local regisitration
router.post('/register', validRegistration, controller.register);

// @desc: Local login
router.post(
	'/login',
	validLogin,
	passport.authenticate('local', { failWithError: true }),
	controller.localLogin
);

// @desc: Log out
router.get('/logout', controller.logout);

// @desc: Google Oauth (initiate)
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile'],
	})
);

// @desc: Google Oauth (callback)
router.get(
	'/google/callback',
	passport.authenticate('google', {
		successRedirect: CLIENT_HOMEPAGE,
		failureRedirect: CLIENT_HOMEPAGE,
		failWithError: true,
	}),
	controller.googleCallback
);

// @desc: Github Oauth (initiate)
router.get(
	'/github',
	passport.authenticate('github', {
		scope: ['profile'],
	})
);

// @desc: Github Oauth (callback)
router.get(
	'/github/callback',
	passport.authenticate('github', {
		successRedirect: CLIENT_HOMEPAGE,
		failureRedirect: CLIENT_HOMEPAGE,
		failWithError: true,
	})
);

router.get('/authenticate_session', controller.authenticateSession);

module.exports = router;
