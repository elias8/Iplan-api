'use strict';
const {response} = require('../../common/response');

module.exports = function TaskController(taskService) {
    return Object.freeze({
        create,
        getAll,
        getById,
        updateById,
        deleteById,
    });

    async function create(request) {
        const taskData = request.body;
        const result = await taskService.createTask(taskData);

        return response(request)
            .fromResult(result)
            .setType('Task')
            .setStatusOnFailure(404)
            .setStatusOnSuccess(201);
    }

    async function getAll(request) {
        const result = await taskService.getAllTasks();

        return response(request)
            .fromResult(result)
            .setType('Tasks')
            .setStatusOnFailure(404)
            .setStatusOnSuccess(200);
    }

    async function getById(request) {
        const taskId = request.params.id;
        const result = await taskService.getTaskById(taskId);

        return response(request)
            .fromResult(result)
            .setType('Task')
            .setStatusOnFailure(404)
            .setStatusOnSuccess(200);
    }

    async function updateById(request) {
        const taskId = request.params.id;
        const taskUpdates = request.body;
        const result = await taskService.updateTaskById(taskId, taskUpdates);

        return response()
            .fromResult(result)
            .setType('Task')
            .setStatusOnSuccess(200)
            .setStatusOnFailure(404)
    }

    async function deleteById(request) {
        const taskId = request.params.id;
        const result = await taskService.deleteById(taskId);

        return response(request)
            .fromResult(result)
            .setStatusOnFailure(404)
            .setStatusOnSuccess(200)
    }
};

