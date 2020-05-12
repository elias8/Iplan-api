'use strict';
const {response} = require('../../common/response');

module.exports = function TaskController(taskService) {
    return {
        create,
        getAll,
        getById,
        updateById,
        deleteById,
    };

    async function create(request) {
        const taskData = request.body;
        const result   = await taskService.createTask(taskData);
        return response(request).fromResult(result);
    }

    async function getAll(request) {
        const result = await taskService.getAllTasks();
        return response(request).fromResult(result);
    }

    async function getById(request) {
        const taskId = request.params.taskId;
        const result = await taskService.getTaskById(taskId);
        return response(request).fromResult(result);
    }

    async function updateById(request) {
        const taskUpdates = request.body;
        const taskId      = request.params.taskId;
        const result      = await taskService.updateTaskById(taskId, taskUpdates);
        return response().fromResult(result);
    }

    async function deleteById(request) {
        const taskId = request.params.taskId;
        const result = await taskService.deleteById(taskId);
        return response(request).fromResult(result);
    }
};

