const dbHandler = require('../../util/db-handler');
const makeTaskDal = require('../../../src/app/task/task-dal');
const taskModel = require('../../../src/app/task/task-model');
const {Success, Failure} = require('../../../src/common/result');

const taskDal = makeTaskDal(taskModel);

describe('TaskDal', () => {

    beforeAll(async () => await dbHandler.connect());

    afterEach(async () => await dbHandler.clearDatabase());

    afterAll(async () => await dbHandler.closeDatabase());

    describe('insert', () => {
        it('should save a task', async () => {
            // ARRANGE
            const task = {
                title: 'task title',
                status: 'Incomplete',
                note: 'task note',
            };

            // ACT
            const result = await taskDal.insertOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.data).toMatchObject(task);
        });
    });

    describe('findOne', () => {
        const task = {
            title: 'task title',
            status: 'Incomplete',
            note: 'task note',
        };

        it('should get a task', async () => {
            // ARRANGE
            await taskDal.insertOne(task);

            // ACT
            const result = await taskDal.findOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.data).toEqual(expect.objectContaining(task));
        });

        it('should return error when query doesn\'t match any task', async () => {
            // ARRANGE
            const message = 'Couldn\'t find a task';

            // ACT
            const result = await taskDal.findOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);
        });
    });

    describe('findById', () => {
        it('should get a task by id', async () => {
            // Arrange
            const task = {
                title: 'task title',
                status: 'Incomplete',
                note: 'task note',
            };
            const savedTask = (await taskDal.insertOne(task)).data;

            // Act
            const result = await taskDal.findById(savedTask._id);

            // Assert
            expect(result).toBeInstanceOf(Success);
            expect(result.data).toMatchObject(task);
            expect(savedTask).toMatchObject(task);
        });

        it('should return error when id doesn\'t match any task id', async () => {
            // ARRANGE
            const taskId = '5e7da13ff820d67f179d0654';
            const message = `Couldn't find a Task with id ${taskId}`;

            // ACT
            const result = await taskDal.findById(taskId);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);
        });

        it('should return error when invalid id is provided', async () => {
            // ARRANGE
            const fakeId = 'fake-id';
            const errorMessage = `Couldn't find a Task with id ${fakeId}`;

            // ACT
            const result = await taskDal.findById(fakeId);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(errorMessage);
        });
    });

    describe('findMany', () => {
        it('should list all tasks', async () => {
            // ARRANGE
            const task1 = {
                title: 'task 1 title',
                status: 'Incomplete',
                note: 'task 1 note',
            };
            const task2 = {
                title: 'task 2 title',
                status: 'Incomplete',
                note: 'task 2 note',
            };

            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            // ACT
            const result = await taskDal.findMany();

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.data).toHaveLength(2);
            expect(result.data[0]).toEqual(expect.objectContaining(task1));
            expect(result.data[1]).toEqual(expect.objectContaining(task2));
        });
    });

    describe('updateOne', () => {
        it('should update a task', async () => {
            // ARRANGE
            const task = {
                title: 'task title',
                status: 'Incomplete',
                note: 'task note',
            };
            const updates = {
                title: 'updated task title',
                status: 'Completed',
                note: 'updated task note',
            };

            const savedTaskResult = await taskDal.insertOne(task);
            const query = {_id: savedTaskResult.data._id};
            const message = 'Task update successfully';

            // ACT
            const result = await taskDal.updateOne({query: query, updates: updates});

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.message).toEqual(message);
            expect(result.data).toEqual(expect.objectContaining(updates));
        });

        it('should return error when task doesn\'t exist', async () => {
            // ARRANGE
            const query = {_id: '5e7d2d3867730855cfd33ba8'};
            const message = 'Unable to find a task to be updated';

            // ACT
            const result = await taskDal.updateOne({query: query});

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);
        });

        it('should return error when invalid query is provided', async () => {
            // ARRANGE
            const message = 'Could not update task';
            const query = {_id: 'invalid-id'};
            const task = {
                title: 'task title',
                status: 'Incomplete',
                note: 'task note',
            };

            // ACT
            const result = await taskDal.updateOne({query: query, updates: task});

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);
        });
    });

    describe('updateMany', () => {
        const task1 = {
            title: 'task 1 title',
            status: 'Incomplete',
            note: 'task 1 note',
        };
        const task2 = {
            title: 'task 2 title',
            status: 'Incomplete',
            note: 'task 2 note',
        };

        it('should update all tasks', async () => {
            // ARRANGE
            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            const updates = {status: 'InProgress'};
            const message = `2 tasks successfully updated`;

            // ACT
            const result = await taskDal.updateMany({updates: updates});

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.message).toEqual(message);
        });

        it('should return error when query contains invalid values', async () => {
            // ARRANGE
            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            const query = {_id: 'invalid-id'};
            const updates = {status: 'InProgress'};
            const message = 'Tasks are not updated. Please check the query or the updates';

            // ACT
            const result = await taskDal.updateMany({query: query, updates: updates});

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);
        });
    });

    describe('deleteOne', () => {
        const task = {
            title: 'task title',
            status: 'Incomplete',
            note: 'task note',
        };

        it('should delete a task', async () => {
            // ARRANGE
            const message = 'Task deleted successfully';
            await taskDal.insertOne(task);

            // ACT
            const result = await taskDal.deleteOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.message).toEqual(message);
        });

        it('should return error when query doesn\'t match any task', async () => {
            // ARRANGE
            const message = `Couldn't find a Task`;
            await taskDal.insertOne(task);

            task.title = 'other title';

            // ACT
            const result = await taskDal.deleteOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);
        });

        it('should return error when query contains invalid arguments', async () => {
            // ARRANGE
            const message = `Couldn't find a Task.`;
            await taskDal.insertOne(task);

            task._id = 'invalid-id';

            // ACT
            const result = await taskDal.deleteOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);

        });
    });

    describe('deleteMany', () => {
        const task1 = {
            title: 'task 1 title',
            status: 'Incomplete',
            note: 'task 1 note',
        };
        const task2 = {
            title: 'task 2 title',
            status: 'Incomplete',
            note: 'task 2 note',
        };

        it('should delete all tasks', async () => {
            // ARRANGE
            const message = `${2} tasks deleted successfully`;
            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            // ACT
            const result = await taskDal.deleteMany();

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.message).toEqual(message);
        });

        it('should return error when query contains invalid values', async () => {
            // ARRANGE
            const message = 'Zero task deleted. Invalid query';
            const query = {_id: 'invalid-id'};

            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            // ACT
            const result = await taskDal.deleteMany(query);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
            expect(result.message).toEqual(message);
        });

    });
});
