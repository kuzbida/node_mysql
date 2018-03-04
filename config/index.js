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
	  }  },
  prod: {}
};

module.exports = config;
