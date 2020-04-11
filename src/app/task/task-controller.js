'use strict';

module.exports = function TaskController(taskService) {
    return Object.freeze({
        create,
        getAll,
        getById,
        updateById,
        deleteById,
    });

    function create(request) {
        const taskData = request.body;
        return taskService.createTask(taskData);
    }

    function getAll() {
        return taskService.getAllTasks();
    }

    function getById(request) {
        const taskId = request.params.id;
        return taskService.getTaskById(taskId);
    }

    function updateById(request) {
        const taskId = request.params.id;
        const taskUpdates = request.body;
        return taskService.updateTaskById(taskId, taskUpdates);
    }

    function deleteById(request) {
        const taskId = request.params.id;
        return taskService.deleteById(taskId);
    }
};

