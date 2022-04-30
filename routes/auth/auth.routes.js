const router = require('express').Router();
const passport = require('passport');
const authController = require('./auth.controller');
const { validRegistration, validLogin } = require('./auth.validators');

// @desc: Local regisitration
router.post('/register', validRegistration, authController.register);

// @desc: Local login
router.post(
	'/login',
	validLogin,
	passport.authenticate('local', { failWithError: true }),
	authController.localLogin
);

// @desc: Google Oauth (initiate)
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile'],
	}),
	authController.googleAuth
);

// @desc: Google Oauth (callback)
router.get(
	'/google/callback',
	passport.authenticate('google', { failWithError: true }),
	authController.googleCallback
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
	passport.authenticate('github', { failWithError: true }),
	authController.githubCallback
);

module.exports = router;
