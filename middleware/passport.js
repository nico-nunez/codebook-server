const passport = require('passport');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const LocalStratetgy = require('passport-local').Strategy;
const { ExpressError } = require('../utils/error');
const models = require('../models/models');

const findOrCreateUser = async (
	id,
	displayName,
	emails,
	provider = 'local'
) => {
	const existingUser = await models.findOneByColumn('users', {
		profile_id: id,
	});
	if (existingUser) {
		return { error: null, user: existingUser };
	}
	const newUser = {
		email: emails[0].value,
		profile_id: id,
		profile_provider: provider,
		profile_name: displayName,
	};
	try {
		const user = await models.insertOne('users', newUser);
		return { error: null, user };
	} catch (error) {
		return { error, user: null };
	}
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/api/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			const { displayName, emails = [{}], id } = profile;
			const { user, error } = await findOrCreateUser(
				id,
				displayName,
				emails,
				'google'
			);
			return done(error, user);
		}
	)
);

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/api/auth/github/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			const { nodeId, displayName, emails = [{}] } = profile;
			const { user, error } = await findOrCreateUser(
				nodeId,
				displayName,
				emails,
				'github'
			);
			return done(error, user);
		}
	)
);

passport.use(
	new LocalStratetgy(
		{ usernameField: 'email' },
		async (email = '', password = '', done) => {
			const user = await models.findOneByColumn('users', { email });
			const match = user && (await bcrypt.compare(password, user.hash));
			if (!match) {
				const error = new ExpressError(['Invalid credentials'], 400);
				return done(error, false);
			}
			delete user.hash;
			return done(null, user);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser(async (userId, done) => {
	const user = await models.findOneById('users', userId);
	done(null, user);
});
