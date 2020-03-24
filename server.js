require('dotenv').config();
const log = require('./src/config/logger');
const app = require('./src/config/express');
const mongoose = require('./src/config/mongoose');

const env = process.env.NODE_ENV;
const port = process.env.PORT;

(async () => {
	const isDataBaseConnected = await mongoose.connect();

	if (!isDataBaseConnected) {
		log.e('Unable to connect DataBase.');
		log.i('Exiting...');
		process.exit(0);
	}
})();


const server = app.listen(port, () => log.i(`API Running in ${env} on port ${port}`));


exports.server = server;
