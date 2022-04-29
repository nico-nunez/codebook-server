const router = require('express').Router();
const passport = require('passport');
const authController = require('./auth.controller');

router.post('/register', authController.register);
router.post(
	'/login',
	passport.authenticate('local', { failWithError: true }),
	authController.localLogin
);

router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile'],
	}),
	authController.googleAuth
);

router.get(
	'/google/callback',
	passport.authenticate('google', { failWithError: true }),
	authController.googleCallback
);

router.get(
	'/github',
	passport.authenticate('github', {
		scope: ['profile'],
	})
);

router.get(
	'/github/callback',
	passport.authenticate('github', { failWithError: true }),
	authController.githubCallback
);

module.exports = router;
