const db = require('./db');
const FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (passport, config) {
	console.log('initializing passport');
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		db.findUser(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy(config.facebook, function (accessToken, refreshToken, profile, done) {
		//TODO add user_id to request
		db.findUserByFacebookId(profile.id, (err, result) => {
			if (err) {
				done({
					status: 400,
					error: err
				}, null);
			}

			//if (result.length === 0) {
			//	db.createUser(profile, (err, result) => {
			//		if (err) {
			//			throw err;
			//		}
			//
			//		done({status: 201}, result);
			//	});
			//} else {
			//	done({
			//		status: 400,
			//		msg: 'You have already signed in'
			//	});
			//}
			done(null, result);
			console.log('FacebookStrategy', result);
		});
	}));
};