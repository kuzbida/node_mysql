const mysql = require('mysql');
let db, configDB;

module.exports = {
	init: (config) => {
		configDB = config.db;

		db = mysql.createConnection(configDB);

// Connection to DB
		db.connect(function (err) {
			/*CREATE SCHEMA `NodeHero` DEFAULT CHARACTER SET utf8 ;*/
			if (err) {
				throw err;
			}
			console.log('DB Connected!');

			db.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${configDB.name}'`, (err, result) => {
				if (err) {
					throw err;
				}
				if (result.length === 0) {
					createDB(createTables);
				} else {
					createTables();
				}
			});
			//createDB().then(() => {
			//	createTables();
			//});
		});

		function createDB(cb) {
			return db.query(`CREATE DATABASE ${configDB.name};`, function (err, result) {
				if (err) {
					throw err;
				}
				console.log('DB created ' + result);
				if (cb) {
					cb();
				}
			});
		}

		function createTables() {
			const usersTable = `CREATE TABLE IF NOT EXISTS ${configDB.name}.users (id int NOT NULL AUTO_INCREMENT, facebook_id VARCHAR(45) NOT NULL, name VARCHAR(45) NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), UNIQUE INDEX facebook_id_UNIQUE (facebook_id ASC))`,
			images = `CREATE TABLE IF NOT EXISTS ${configDB.name}.images (id int NOT NULL AUTO_INCREMENT, name VARCHAR(45) NULL, created VARCHAR(45) NULL, path VARCHAR(45) NULL, user_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES ${configDB.name}.users (id) ON DELETE CASCADE ON UPDATE NO ACTION);`;

			db.query(usersTable, function (err, result) {
				if (err) {
					throw err;
				}
				console.log('Table users created');
			});

			db.query(images, function (err, result) {
				if (err) {
					throw err;
				}
				console.log('Table images created');
			});
		}
	},

	findUser: function (id, cb) {
		return db.query(`SELECT * FROM ${configDB.name}.users where id = '${id}';`, cb);
	},

	findUserByFacebookId: function (facebookId, cb) {
		return db.query(`SELECT * FROM ${configDB.name}.users where facebook_id = '${facebookId}';`, cb);
	},

	createUser: function (profile, cb) {
		return db.query(`INSERT INTO ${configDB.name}.users (facebook_id,name) VALUES ('${profile.id}','${profile.displayName}');`, cb);
	},

	saveImage: function (name, cb) {
		return db.query(`INSERT INTO ${configDB.name}.images (name, path) VALUES ('${name}','images/${name}');`, cb);
	}
};