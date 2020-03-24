const express = require('express');
const router = express.Router();
const taskRouter = require('../app/task/task-router');

router.use('/tasks', taskRouter);

module.exports = router;
