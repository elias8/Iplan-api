'use strict';

const taskDal = require('./task-dal');
const {SuccessResult} = require("../../common/result");

exports.createTask = async (task) => {
    return await taskDal.create(task);
};

exports.getAllTasks = async () => {
    const tasks = await taskDal.findMany({});
    return new SuccessResult({data: tasks});
};

exports.getTaskById = async (taskId) => {
    return taskDal.findById({id: taskId});
};

exports.updateTaskById = async (taskId, task) => {
    return taskDal.updateOne({query: {_id: taskId}, value: task});
};

exports.deleteById = async (taskId) => {
    const result = await taskDal.deleteOne({_id: taskId});

    return result.fold({
        onSuccess: () => result.withMessage('Task deleted successfully.'),
        onError: (error) => error
    });
};
