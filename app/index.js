const path = require('path');
const fs = require('fs');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
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
app.use(cookieParser());

// TODO this should be used for admin console
//require('./authentication').init(app);

app.use(session({
	cookie: { secure: true },
	secret: config.redisStore.secret,
	resave: false,
	saveUninitialized: true
}));
//app.use(session({
//	store: new RedisStore({
//		url: config.redisStore.url
//	}),
//	secret: config.redisStore.secret,
//	resave: false,
//	saveUninitialized: true
//}));

require('./passport')(passport, config);

app.use(passport.initialize());
app.use(passport.session());

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', (req, res, next) => {
	passport.authenticate('facebook', {
		successRedirect: '/success',
		failureRedirect: '/reject'
	}, (err, user) => {
		//console.log('/auth/facebook/callback', req);
		//console.log('/auth/facebook/callback', ev);
		if (err) {
			res.redirect('/sorry');
		} else {
			res.redirect('/success');
		}
	})(req, res, next);
});

app.get('/', (req, res) => {
	res.render('pages/welcome');
});
app.get('/success', ensureAuthenticated, (req, res) => {
	res.render('pages/success');
});
app.get('/reject', (req, res) => {
	return res.render('pages/reject');
});
app.get('/sorry', (req, res) => {
	return res.render('pages/reject');
});

function ensureAuthenticated(req, res, next) {
	console.log("This is the authentication middleware, is req authenticated?");
	console.log(req.isAuthenticated());
	console.log("Does req.user exist?");
	console.log(req.user);
	return next();
	//if (req.isAuthenticated()) {
	//	return next();
	//}
	//res.redirect('/auth/facebook');
}


app.post('/image', );

//app.get('/server', ensureAuthenticated, routes.server.get);
//app.get('/login', routes.login.get);

app.engine('.hbs', exphbs({
	defaultLayout: 'layout',
	extname: '.hbs',
	layoutsDir: path.join(__dirname),
	partialsDir: path.join(__dirname)
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname));

//require('./user').init(app);
//require('./note').init(app);

module.exports = app;
