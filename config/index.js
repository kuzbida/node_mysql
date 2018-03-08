const config = {
  dev: {
	  redisStore: {
		  url: 'redis://localhost',
		  secret: 'my-strong-secret'
	  },
	  db: {
		  name: 'NodeHero',
		  user: 'NodeHero',
		  password: 'NodeHeroPass',
		  host: '127.0.0.1'
	  },
	  facebook: {
		  clientID: 1967627570166404,
		  clientSecret: '29f52bcd77db7f244298f9b42b3953f8',
		  callbackURL: "http://localhost:3000/auth/facebook/callback"
	  }
  },
  prod: {}
};

module.exports = config;
