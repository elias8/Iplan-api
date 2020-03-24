'use strict';

const taskService = require('./task-service');
const {response} = require("../../common/response");

exports.create = async (req, res) => {
    const taskData = req.body;
    const result = await taskService.createTask(taskData);

    response(res)
        .fromResult(result)
        .withType('Task')
        .withSuccessStatus(201)
        .end();
};

exports.getAll = async (req, res) => {
    const result = await taskService.getAllTasks();

    response(res)
        .fromResult(result)
        .withType('Tasks')
        .withSuccessStatus(200)
        .withErrorStatus(404)
        .end();
};

exports.getById = async (req, res) => {
    const taskId = req.params.id;
    const result = await taskService.getTaskById(taskId);

    response(res)
        .fromResult(result)
        .withType('Task')
        .withSuccessStatus(200)
        .withErrorStatus(404)
        .end();
};

exports.updateById = async (req, res) => {
    const taskId = req.params.id;
    const taskUpdates = req.body;

    const result = await taskService.updateTaskById(taskId, taskUpdates);

    response(res)
        .fromResult(result)
        .withType('Task')
        .withSuccessStatus(200)
        .withErrorStatus(400)
        .end();
};

exports.deleteById = async (req, res) => {
    const taskId = req.params.id;

    const result = await taskService.deleteById(taskId);

    response(res)
        .fromResult(result)
        .withSuccessStatus(200)
        .withErrorStatus(400)
        .end();
};
