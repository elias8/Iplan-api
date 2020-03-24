'use strict';

const router = require('express').Router();
const taskValidator = require('./task-validator');
const taskController = require('./task-controller');

router.post('/',
    taskValidator.validateTask,
    taskController.create
);

router.get('/', taskController.getAll);

router.get('/:id',
    taskValidator.validateTaskId,
    taskController.getById
);

router.put('/:id',
    taskValidator.validateTaskId,
    taskValidator.validateTaskUpdates,
    taskController.updateById
);

router.delete('/:id',
    taskValidator.validateTaskId,
    taskController.deleteById
);

module.exports = router;
