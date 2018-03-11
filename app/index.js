const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const db = require('./db');
let config;
const app = express();

switch (process.env.env) {
	case 'prod':
		config = require('../config').prod;
		break;
	default:
		config = require('../config').dev;
		break;
}

db.init(config);

app.use(bodyParser.urlencoded({
	extended: false
}));

// TODO this should be used for admin console
//require('./authentication').init(app);

app.use(session({
	store: new RedisStore({
		url: config.redisStore.url
	}),
	secret: config.redisStore.secret,
	resave: false,
	saveUninitialized: false
}));

passport.use(new FacebookStrategy(config.facebook, function (accessToken, refreshToken, profile, done) {

	db.findUser(profile.id, (err, result) => {
		if (err) {
			next(err);
		}

		if (result.length === 0) {
			db.createUser(profile, (err, result) => {
				if (err) {
					throw err;
				}

				done(result);
			});
		} else {

			done();
		}
		console.log(result);
	});

}));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', exphbs({
	defaultLayout: 'layout',
	extname: '.hbs',
	layoutsDir: path.join(__dirname),
	partialsDir: path.join(__dirname)
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname));

require('./user').init(app);
require('./note').init(app);

module.exports = app;
