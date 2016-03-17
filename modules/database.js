var fs = require('fs');
var mysql = require('mysql');
var file = fs.readFileSync('db_config.json', 'utf8');
var json = JSON.parse(file);

var environment = process.env.NODE_ENV;
if (environment == undefined) environment = 'development';
exports.db = mysql.createConnection(json[environment]);

// The following database connection shouldn't be used anywhere else as it allows multiple statements
// which are UNSAFE if user input is added.
var options = json[environment];
options.multipleStatements = true;
var database = mysql.createConnection(options);

exports.createTables = function(callback) {
	var query = `
	CREATE TABLE IF NOT EXISTS USERS
	(
	U_ID INTEGER NOT NULL AUTO_INCREMENT,
	EMAIL varchar(50) NOT NULL UNIQUE,
	PASSWORD varchar(60) NOT NULL,
	FIRST_NAME varchar(50) NOT NULL,
	LAST_NAME varchar(50) NOT NULL,
	BIO text,
	PRIMARY KEY(U_ID)
	);

	CREATE TABLE IF NOT EXISTS DOCUMENTS
	(
	DOC_ID INTEGER NOT NULL AUTO_INCREMENT,
	OWNER_ID INTEGER,
	EXTENSIONS varchar(50) NOT NULL,
	DESCRIPTION varchar(50) NOT NULL,
	TITLE varchar(50) NOT NULL,
	PREVIEW varchar(10),
	AVG_RATING FLOAT,
	PROVINCE varchar(50),
	GRADE varchar(10),
	SUBJECT varchar(20),
	FOREIGN KEY (OWNER_ID) REFERENCES USERS (U_ID),
	PRIMARY KEY(DOC_ID)
	);

	CREATE TABLE IF NOT EXISTS RATING
	(
	USER_REVIEWED_BY INTEGER,
	OWNER INTEGER,
	RATING INTEGER,
	DOC_ID INTEGER NOT NULL,
	FOREIGN KEY (DOC_ID) REFERENCES DOCUMENTS(DOC_ID) ON DELETE CASCADE,
	FOREIGN KEY (OWNER) REFERENCES USERS (U_ID),
	FOREIGN KEY (USER_REVIEWED_BY) REFERENCES USERS (U_ID),
	PRIMARY KEY  (USER_REVIEWED_BY, DOC_ID)
	);

	CREATE TABLE IF NOT EXISTS DOWNLOADS
	(
	DOWNLOADER INTEGER REFERENCES USERS(U_ID),
	DOC_ID INTEGER REFERENCES DOCUMENTS(DOC_ID),
	TIMESTAMP TIME,
	FOREIGN KEY (DOWNLOADER) REFERENCES USERS (U_ID),
	FOREIGN KEY (DOC_ID) REFERENCES DOCUMENTS (DOC_ID),
	PRIMARY KEY(DOWNLOADER, DOC_ID)
	);

	CREATE TABLE IF NOT EXISTS COMMENTS
	(
	COMMENT_ID INTEGER NOT NULL AUTO_INCREMENT,
	DOC_ID INTEGER NOT NULL,
	OWNER INTEGER REFERENCES USERS(U_ID),
	COMMENT VARCHAR(150),
	FOREIGN KEY (DOC_ID) REFERENCES DOCUMENTS(DOC_ID) ON DELETE CASCADE,
	FOREIGN KEY (OWNER) REFERENCES USERS (U_ID),
	PRIMARY KEY(COMMENT_ID)
	);
	`;
	database.query(query, function(err) {
		if (err) throw err;
		callback();
	});
};

exports.dropTables = function(callback) {
	query = `
	DROP TABLE IF EXISTS RATING, DOWNLOADS, COMMENTS, DOCUMENTS, USERS
	`;

	database.query(query, function(err) {
		if (err) throw err;
		callback();
	});
};
