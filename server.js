require('dotenv').config();
const log = require('./src/config/logger');
const app = require('./src/config/express');
const {databaseUrl} = require('./src/config/variables');
const makeDatabase = require('./src/config/database');

const env = process.env.NODE_ENV;
const port = process.env.PORT;

(async () => {
	const database = makeDatabase();
	const isDataBaseConnected = await database.connect(databaseUrl.uri);

	if (!isDataBaseConnected) {
		log.e('Database connection failed.');
		log.i('Exiting application...');
		process.exit(0);
	}
})();

const server = app.listen(port, () => log.i(`API Running in ${env} on port ${port}`));

exports.server = server;
