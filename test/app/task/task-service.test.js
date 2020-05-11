const {Success, Failure} = require('../../../src/common/result');
const makeTaskDal        = require('../../../src/app/task/task-dal');
const makeTaskService    = require('../../../src/app/task/task-service');


describe('TaskService', function () {
    let taskDal;
    let taskService;

    beforeEach(() => {
        taskDal     = makeTaskDal();
        taskService = makeTaskService(taskDal);
    });

    describe('createTask', () => {
        const task = {
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        };

        it('should save and return a task', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'insertOne').mockReturnValue(new Success(task));

            // ACT
            const result = await taskService.createTask(task);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.data).toBe(task);
            expect(result.getCode()).toBe(201);
            expect(result.getType()).toBe('Task');
        });
    });

    describe('getAllTasks', () => {
        const tasks = [{
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        }, {
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        }];


        it('should return Success result of list of task', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'findMany').mockReturnValue(new Success(tasks));

            // ACT
            const result = await taskService.getAllTasks();

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.data).toBe(tasks);
            expect(result.getCode()).toBe(200);
            expect(result.getType()).toBe('Tasks');
        });
    });

    describe('getTaskById', () => {
        const taskId = 'a4s6df5a4s3fas7fa3s5f1a3sd';
        const task   = {
            _id   : taskId,
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        };

        it('should return task when a task id match', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'findById').mockReturnValue(new Success(task));

            // ACT
            const result = await taskService.getTaskById(taskId);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.getCode()).toBe(200);
            expect(result.getType()).toBe('Task');
            expect(taskDal.findById).toHaveBeenCalledWith(taskId);
            expect(taskDal.findById).toBeCalledTimes(1);
        });

        it('should return Failure result when task is not found with specified id', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'findById').mockReturnValue(new Failure());

            // ACT
            const result = await taskService.getTaskById(taskId);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.getCode()).toBe(404);
            expect(taskDal.findById).toHaveBeenCalledWith(taskId);
            expect(taskDal.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateTaskById', () => {
        const taskId  = 'a4s6df5a4s3fas7fa3s5f1a3sd';
        const oldTask = {
            _id   : taskId,
            title : 'task title',
            status: 'Incomplete',
            note  : 'task note',
        };
        const task    = {
            _id   : taskId,
            title : 'task title',
            status: 'Completed',
            note  : 'task note',
        };

        it('should update and return updated task when the id match', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'findById')
                .mockResolvedValue(new Success(oldTask))
                .mockResolvedValue(new Success(task));

            jest.spyOn(taskDal, 'updateOne').mockResolvedValue(new Success(task));

            // ACT
            const result = await taskService.updateTaskById(taskId, task);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.data).toBe(task);
            expect(result.getCode()).toBe(200);
            expect(taskDal.findById).toHaveBeenCalledWith(taskId);
            expect(taskDal.findById).toHaveBeenCalledTimes(2);
            expect(taskDal.updateOne).toHaveBeenCalledWith({query: {_id: taskId}, updates: task});
            expect(taskDal.updateOne).toHaveBeenCalledTimes(1);
        });


        it('should return Failure result when task does not exist before', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'findById').mockResolvedValue(new Failure());

            // ACT
            const result = await taskService.updateTaskById(taskId, task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.getCode()).toBe(404);
            expect(taskDal.findById).toHaveBeenCalledWith(taskId);
            expect(taskDal.findById).toHaveBeenCalledTimes(1);
        });

        it('should return Failure when updating task is failed', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'findById').mockResolvedValue(new Success(oldTask));
            jest.spyOn(taskDal, 'updateOne').mockResolvedValue(new Failure());

            // ACT
            const result = await taskService.updateTaskById(taskId, task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.getCode()).toBe(400);
            expect(taskDal.findById).toHaveBeenCalledWith(taskId);
            expect(taskDal.findById).toHaveBeenCalledTimes(1);
        });

    });

    describe('deleteById', () => {
        const taskId = '4as3f1as3df5a4sd1f2';

        it('should delete a task when task already exists ', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'deleteOne');
            jest.spyOn(taskDal, 'findById').mockResolvedValue(new Success());

            // ACT
            const result = await taskService.deleteById(taskId);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.getCode()).toBe(200);
            expect(taskDal.findById).toHaveBeenCalledWith(taskId);
            expect(taskDal.findById).toHaveBeenCalledTimes(1);
            expect(taskDal.deleteOne).toHaveBeenCalledTimes(1);
            expect(taskDal.deleteOne).toHaveBeenCalledWith({_id: taskId});
        });

        it('should return Failure when task does not exist before', async () => {
            // ARRANGE
            jest.spyOn(taskDal, 'findById').mockResolvedValue(new Failure());

            // ACT
            const result = await taskService.deleteById(taskId);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.getCode()).toBe(404);
            expect(taskDal.findById).toHaveBeenCalledWith(taskId);
            expect(taskDal.findById).toHaveBeenCalledTimes(1);
        });

    });
});