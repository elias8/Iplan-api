'use strict';

const router = require('express').Router();
const transform = require('../../config/request-transformer');

const taskValidator = require('./task-validator');
const taskController = require('./task-di');

router.post('/',
    taskValidator.validateTask,
    transform(taskController.create)
);

router.get('/', transform(taskController.getAll));

router.get('/:id',
    taskValidator.validateTaskId,
    transform(taskController.getById)
);

router.put('/:id',
    taskValidator.validateTaskId,
    taskValidator.validateTaskUpdates,
    transform(taskController.updateById)
);

router.delete('/:id',
    taskValidator.validateTaskId,
    transform(taskController.deleteById)
);

module.exports = router;
