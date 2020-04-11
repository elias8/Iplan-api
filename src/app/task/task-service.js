'use strict';

const Task = require('./task-model');

const makeTaskDatabase = require('./task-dal');
const taskDal = makeTaskDatabase(Task);

exports.createTask = async (task) => taskDal.insertOne(task);

exports.getAllTasks = async () => await taskDal.findMany();

exports.getTaskById = async (taskId) => await taskDal.findById(taskId);

exports.updateTaskById = async (taskId, task) => {
    return taskDal.updateOne({query: {_id: taskId}, updates: task});
};

exports.deleteById = async (taskId) => await taskDal.deleteOne({_id: taskId});
