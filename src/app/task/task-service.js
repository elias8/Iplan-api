'use strict';

module.exports = function TaskService(database) {
    return Object.freeze({
        createTask,
        getAllTasks,
        getTaskById,
        updateTaskById,
        deleteById,
    });

    async function createTask(task) {
        return database.insertOne(task);
    }

    async function getAllTasks() {
        return database.findMany();
    }

    async function getTaskById(taskId) {
        return database.findById(taskId);
    }

    async function updateTaskById(taskId, task) {
        return database.updateOne({query: {_id: taskId}, updates: task});
    }

    async function deleteById(taskId) {
        return database.deleteOne({_id: taskId});
    }
};
