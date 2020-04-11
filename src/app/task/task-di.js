const Task = require('./task-model');
const TaskDatabase = require('./task-dal');
const TaskService = require('./task-service');
const TaskController = require('./task-controller');

const taskDal = TaskDatabase(Task);
const taskService = TaskService(taskDal);

module.exports = TaskController(taskService);

