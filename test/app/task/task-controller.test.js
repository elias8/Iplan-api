const {Response}         = require('../../../src/common/response');
const {Success, Failure} = require('../../../src/common/result');
const TaskService        = require('../../../src/app/task/task-service');
const TaskController     = require('../../../src/app/task/task-controller');


describe('TaskController', () => {
    let taskService;
    let taskController;

    beforeEach(() => {
        taskService    = TaskService();
        taskController = TaskController(taskService);
    });

    describe('create', () => {
        const task    = {
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        };
        const request = {body: task};

        it('should save and return task with status code 201', async () => {
            // ARRANGE
            const result = new Success(task, {message: 'Task created'}).setCode(201).setType('Task');

            jest.spyOn(taskService, 'createTask').mockReturnValue(result);

            // ACT
            const response = await taskController.create(request);

            // ASSERT
            expect(response).toBeInstanceOf(Response);
            expect(response.getData()).toBe(result.data);
            expect(response.getMessage()).toBe(result.getMessage());
            expect(response.getStatusCode()).toBe(result.getCode());
            expect(taskService.createTask).toHaveBeenCalledWith(task);
            expect(taskService.createTask).toHaveBeenCalledTimes(1);
        });
    });

    describe('getAll', () => {
        const tasks = [{
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        }, {
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        }];

        it('should return all tasks with status code 200', async () => {
            // ARRANGE
            const result = new Success(tasks, {status: 200, type: 'Tasks'});
            jest.spyOn(taskService, 'getAllTasks').mockReturnValue(result);

            // ACT
            const response = await taskController.getAll();

            // ASSERT
            expect(taskService.getAllTasks).toHaveBeenCalled();
            expect(response.getData()).toBe(result.getData());
            expect(response.getType()).toBe(result.getType());
            expect(response.getStatusCode()).toBe(result.getCode());
        });
    });

    describe('getById', () => {
        const taskId  = '4as65df4asd3fas78';
        const task    = {
            _id   : taskId,
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        };
        const request = {params: {taskId: taskId}};

        it('should return task with status code 200', async () => {
            // ARRANGE
            const result = new Success(task, {status: 200, type: 'Task'});
            jest.spyOn(taskService, 'getTaskById').mockReturnValue(result);

            // ACT
            const response = await taskController.getById(request);

            // ASSERT
            expect(response.getData()).toBe(result.getData());
            expect(response.getType()).toBe(result.getType());
            expect(response.getStatusCode()).toBe(result.getCode());
            expect(taskService.getTaskById).toHaveBeenCalledWith(taskId);
            expect(taskService.getTaskById).toHaveBeenCalledTimes(1);
        });

        it('should return status code 404 when task is not found', async () => {
            // ARRANGE
            const result = new Failure({status: 404});
            jest.spyOn(taskService, 'getTaskById').mockReturnValue(result);

            // ACT
            const response = await taskController.getById(request);

            // ASSERT
            expect(response.getStatusCode()).toBe(result.getCode());
            expect(taskService.getTaskById).toHaveBeenCalledWith(taskId);
            expect(taskService.getTaskById).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateById', () => {
        const taskId      = '4as65df4asd3fas78';
        const taskUpdates = {
            _id   : taskId,
            title : 'task title',
            status: 'Completed',
            note  : 'task note',
        };
        it('should update and return updated task with status code 200', async () => {
            // ARRANGE
            const result = new Success(taskUpdates, {status: 200, type: 'Task'});
            jest.spyOn(taskService, 'updateTaskById').mockReturnValue(result);

            // ACT
            const response = await taskController.updateById(request);

            // ASSERT
            expect(response).toBeInstanceOf(Response);
            expect(response.getData()).toBe(result.getData());
            expect(response.getType()).toBe(result.getType());
            expect(taskService.updateTaskById).toHaveBeenCalledTimes(1);
            expect(taskService.updateTaskById).toHaveBeenCalledWith(taskId, taskUpdates);
        });

        const request = {params: {taskId: taskId}, body: taskUpdates};

        it('should return status code 404 when task is not found to update', async () => {
            // ARRANGE
            const result = new Failure({status: 404});
            jest.spyOn(taskService, 'updateTaskById').mockReturnValue(result);

            // ACT
            const response = await taskController.updateById(request);

            // ASSERT
            expect(response).toBeInstanceOf(Response);
            expect(response.getStatusCode()).toBe(result.getCode());
            expect(taskService.updateTaskById).toHaveBeenCalledTimes(1);
            expect(taskService.updateTaskById).toHaveBeenCalledWith(taskId, taskUpdates);
        });
    });

    describe('deleteById', () => {
        const taskId = '4as65df4asd3fas78';

        const request = {params: {taskId: taskId}};

        it('should delete and return status code 200', async () => {
            // ARRANGE
            const result = new Success().setCode(200);
            jest.spyOn(taskService, 'deleteById').mockReturnValue(result);

            // ACT
            const response = await taskController.deleteById(request);

            // ASSERT
            expect(response).toBeInstanceOf(Response);
            expect(response.getStatusCode()).toBe(result.getCode());
            expect(taskService.deleteById).toHaveBeenCalledWith(taskId);
            expect(taskService.deleteById).toHaveBeenCalledTimes(1);
        });

        it('should return status code 404 when task is not found to delete', async () => {
            // ARRANGE
            const result = new Failure({status: 404});
            jest.spyOn(taskService, 'deleteById').mockReturnValue(result);

            // ACT
            const response = await taskController.deleteById(request);

            // ASSERT
            expect(response).toBeInstanceOf(Response);
            expect(response.getStatusCode()).toBe(result.getCode());
            expect(taskService.deleteById).toHaveBeenCalledWith(taskId);
            expect(taskService.deleteById).toHaveBeenCalledTimes(1);
        });
    });
});