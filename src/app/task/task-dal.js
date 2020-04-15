'use strict';

const {Success, Failure} = require('../../common/result');

function makeTaskDatabase(database) {
    return Object.freeze({
        insertOne,
        findOne,
        findById,
        findMany,
        updateOne,
        updateMany,
        deleteOne,
        deleteMany,
    });

    async function insertOne(taskData) {
        const savedTask = await new database(taskData).save();
        return new Success(savedTask);
    }

    async function findById(id) {
        try {
            const result = await database.findById(id);
            return result ? new Success(result) : new Failure();
        } catch (e) {
            return new Failure();
        }
    }

    async function findOne(query) {
        const result = await database.findOne(query);
        return result ? new Success(result) : new Failure();
    }

    async function findMany(query) {
        const tasks = await database.find(query);
        return new Success(tasks);
    }

    async function updateOne({query, updates}) {
        try {
            const result = await database.updateOne(query, updates);
            const nModified = result.nModified;
            return nModified > 0 ? new Success(nModified) : new Failure();
        } catch (e) {
            return new Failure();
        }
    }

    async function updateMany({query, updates}) {
        try {
            const result = await database.updateMany(query, updates);
            const nModified = result.nModified;
            return new Success(nModified);
        } catch (e) {
            return new Failure();
        }
    }

    async function deleteOne(query) {
        try {
            const result = await database.deleteOne(query);
            const deletedCount = result.deletedCount;
            return deletedCount > 0 ? new Success(deletedCount) : new Failure();
        } catch (e) {
            return new Failure();
        }
    }

    async function deleteMany(query) {
        try {
            const result = await database.deleteMany(query);
            const deletedCount = result.deletedCount;
            return new Success(deletedCount);
        } catch (e) {
            return new Failure();
        }
    }
}

module.exports = (db) => makeTaskDatabase(db);
