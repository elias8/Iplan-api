'use strict';
const bcrypt = require('bcrypt-nodejs');
const WORK_FACTOR = process.env.SALT_WORK_FACTOR;

const genSalt = async () => {
	return bcrypt.genSaltSync(WORK_FACTOR);
};

exports.hasPassword = async (password) => {
	const salt = await genSalt();
	return bcrypt.hashSync(password, salt);
};

exports.comparePassword = async (password, encryptedPassword) => {
	return bcrypt.compareSync(password, encryptedPassword);
};


