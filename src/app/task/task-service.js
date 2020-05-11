'use strict';

const {Success} = require('../../common/result');

module.exports = function TaskService(database) {
    return {
        createTask,
        deleteById,
        getAllTasks,
        getTaskById,
        updateTaskById,
    };

    async function createTask(task) {
        const result  = await database.insertOne(task);
        const message = 'Task created successfully';
        return result.withMessage(message).setCode(201).setType('Task');
    }

    async function getAllTasks() {
        const result = await database.findMany();
        return result.setCode(200).setType('Tasks');
    }

    async function getTaskById(taskId) {
        const result = await database.findById(taskId);

        return result.fold({
            onSuccess: () => result.setType('Task').setCode(200),
            onFailure: (failure) => {
                const message = `Could not find a task with id ${taskId}`;
                return failure.setCode(404).withMessage(message);
            }
        });
    }

    async function updateTaskById(taskId, task) {
        const taskExists = await getTaskById(taskId);
        if (taskExists.isFailure()) return taskExists;

        const query        = {_id: taskId};
        const updateResult = await database.updateOne({
            query  : query,
            updates: task
        });

        return updateResult.fold({
            onFailure: onTaskUpdateFailed,
            onSuccess: onTaskUpdateSuccess,
        });
    }

    async function onTaskUpdateSuccess(taskId) {
        const message = 'Task updated successfully';
        const result  = await getTaskById(taskId);
        return result.setCode(200).withMessage(message);
    }

    async function onTaskUpdateFailed(failure) {
        const message = 'Unable to update a task';
        return failure.setCode(400).withMessage(message);
    }

    async function deleteById(taskId) {
        const result = await getTaskById(taskId);
        if (result.isFailure()) return result;

        await database.deleteOne({_id: taskId});
        const message = 'Task deleted successfully.';
        return new Success(message).setCode(200);
    }
};
