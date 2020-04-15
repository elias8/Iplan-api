'use strict';

const {Success} = require('../../common/result');

module.exports = function TaskService(database) {
    return Object.freeze({
        createTask,
        getAllTasks,
        getTaskById,
        updateTaskById,
        deleteById,
    });

    async function createTask(task) {
        const result = await database.insertOne(task);
        const message = 'Task created successfully';
        return result.withMessage(message);
    }

    async function getAllTasks() {
        return await database.findMany();
    }

    async function getTaskById(taskId) {
        const result = await database.findById(taskId);

        return result.fold({
            onSuccess: () => result,
            onFailure: (failure) => {
                const message = `Could not find a task with id ${taskId}`;
                return failure.withMessage(message);
            }
        });
    }

    async function updateTaskById(taskId, task) {
        const taskExists = await database.findById(taskId);

        if (taskExists.isSuccess()) {
            const query = {_id: taskId};
            const updateResult = await database.updateOne({
                query: query,
                updates: task
            });

            return updateResult.fold({
                onSuccess: async () => {
                    const message = 'Task updated successfully';
                    const updatedResult = await getTaskById(taskId);
                    return updatedResult.withMessage(message);
                },
                onFailure: (failure) => {
                    const message = 'Unable to update a task';
                    return failure.withMessage(message);
                }
            });
        } else {
            const message = `Could not find a task with id ${taskId}`;
            return taskExists.withMessage(message);
        }
    }

    async function deleteById(taskId) {
        const result = await database.findById(taskId);

        return result.fold({
            onSuccess: async () => {
                await database.deleteOne({_id: taskId});
                const message = 'Task deleted successfully.';
                return new Success(message);
            },
            onFailure: (failure) => {
                const message = `Could not find a task with id ${taskId}`;
                return failure.withMessage(message);
            }
        });
    }
};
