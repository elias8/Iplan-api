'use strict';

const {ErrorResult} = require("../../common/result");
const {SuccessResult} = require("../../common/result");

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
        return new SuccessResult(savedTask);
    }

    async function findById(id) {
        try {
            const result = await database.findById(id);

            if (result) return new SuccessResult(result);

            const message = `Couldn't find a Task with id ${id}`;
            return new ErrorResult(message);
        } catch (error) {
            const message = `Couldn't find a Task with id ${id}`;
            return new ErrorResult(message);
        }
    }

    async function findOne(query) {
        const result = await database.findOne(query);

        if (result === null) {
            const message = 'Couldn\'t find a task';
            return new ErrorResult(message);
        }

        return new SuccessResult(result);
    }

    async function findMany(query) {
        const tasks = await database.find(query);
        return new SuccessResult(tasks);
    }

    async function updateOne({query, updates}) {
        try {
            const result = await database.updateOne(query, updates);
            if (result.n < 1 && result.nModified < 1) {
                const message = 'Unable to find a task to be updated';
                return new ErrorResult(message);
            }

            const updatedTask = await findOne(query);
            const message = 'Task update successfully';
            return updatedTask.withMessage(message);
        } catch (error) {
            const message = 'Could not update task';
            return new ErrorResult(message);
        }
    }

    async function updateMany({query, updates}) {
        try {
            const result = await database.updateMany(query, updates);
            const message = `${result.nModified} tasks successfully updated`;
            return new SuccessResult(null, {message: message});
        } catch (error) {
            const message = 'Tasks are not updated. Please check the query or the updates';
            return new ErrorResult(message);
        }
    }

    async function deleteOne(query) {
        try {
            const result = await database.deleteOne(query);

            if (result.deletedCount < 1) {
                const message = 'Couldn\'t find a Task';
                return new ErrorResult(message);
            }

            const message = 'Task deleted successfully';
            return new SuccessResult(null, {message: message});
        } catch (error) {
            const message = `Couldn't find a Task.`;
            return new ErrorResult(message);
        }
    }

    async function deleteMany(query) {
        try {
            const result = await database.deleteMany(query);

            const message = `${result.deletedCount} tasks deleted successfully`;
            return new SuccessResult(null, {message: message});
        } catch (error) {
            const message = 'Zero task deleted. Invalid query';
            return new ErrorResult(message);
        }
    }
}

module.exports = (db) => makeTaskDatabase(db);
