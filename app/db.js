const mysql = require('mysql');
let db;

module.exports = {
	init: (config) => {

		db = mysql.createConnection(config.db);

// Connection to DB
		db.connect(function (err) {
			/*CREATE SCHEMA `NodeHero` DEFAULT CHARACTER SET utf8 ;*/
			if (err) {
				throw err;
			}
			console.log('DB Connected!');

			db.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${config.db.name}'`, (err, result) => {
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
			return db.query(`CREATE DATABASE ${config.db.name};`, function (err, result) {
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
			const usersTable = `CREATE TABLE IF NOT EXISTS ${config.db.name}.users (id VARCHAR(45) NOT NULL, email VARCHAR(45) NOT NULL, name VARCHAR(45) NULL, created DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), UNIQUE INDEX email_UNIQUE (email ASC))`,
			images = `CREATE TABLE IF NOT EXISTS ${config.db.name}.images (id INT NOT NULL, name VARCHAR(45) NULL, created VARCHAR(45) NULL, path VARCHAR(45) NULL, user_id VARCHAR(45) NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES ${config.db.name}.users (id) ON DELETE CASCADE ON UPDATE NO ACTION);`;

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
	}
};