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

        it('should return Failure when query doesn\'t match any task', async () => {
            // ARRANGE

            // ACT
            const result = await taskDal.findOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
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
            const savedTask = (await taskDal.insertOne(task)).getData();

            // Act
            const result = await taskDal.findById(savedTask._id);

            // Assert
            expect(result).toBeInstanceOf(Success);
            expect(result.getData()).toMatchObject(task);
            expect(savedTask).toMatchObject(task);
        });

        it('should return Failure when id doesn\'t match any task id', async () => {
            // ARRANGE
            const taskId = '5e7da13ff820d67f179d0654';

            // ACT
            const result = await taskDal.findById(taskId);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
        });

        it('should return Failure when invalid id is provided', async () => {
            // ARRANGE
            const fakeId = 'fake-id';

            // ACT
            const result = await taskDal.findById(fakeId);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
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
            expect(result.getData()).toHaveLength(2);
            expect(result.getData()[0]).toEqual(expect.objectContaining(task1));
            expect(result.getData()[1]).toEqual(expect.objectContaining(task2));
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

            // ACT
            await taskDal.updateOne({query: query, updates: updates});
            const result = await taskDal.findOne(query);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.getData()).toEqual(expect.objectContaining(updates));
        });

        it('should return Failure when task doesn\'t exist', async () => {
            // ARRANGE
            const query = {_id: '5e7d2d3867730855cfd33ba8'};

            // ACT
            const result = await taskDal.updateOne({query: query});

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
        });

        it('should return Failure when invalid query is provided', async () => {
            // ARRANGE
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

            // ACT
            const result = await taskDal.updateMany({updates: updates});

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.getData()).toEqual(2);
        });

        it('should return Failure when query contains invalid values', async () => {
            // ARRANGE
            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            const query = {_id: 'invalid-id'};
            const updates = {status: 'InProgress'};

            // ACT
            const result = await taskDal.updateMany({query: query, updates: updates});

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
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
            await taskDal.insertOne(task);

            // ACT
            const result = await taskDal.deleteOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Success);
        });

        it('should return Failure when query doesn\'t match any task', async () => {
            // ARRANGE
            await taskDal.insertOne(task);

            task.title = 'other title';

            // ACT
            const result = await taskDal.deleteOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
        });

        it('should return Failure when query contains invalid arguments', async () => {
            // ARRANGE
            await taskDal.insertOne(task);

            task._id = 'invalid-id';

            // ACT
            const result = await taskDal.deleteOne(task);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
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
            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            // ACT
            const result = await taskDal.deleteMany();

            // ASSERT
            expect(result).toBeInstanceOf(Success);
            expect(result.getData()).toEqual(2);
        });

        it('should return Failure when query contains invalid values', async () => {
            // ARRANGE
            const query = {_id: 'invalid-id'};

            await taskDal.insertOne(task1);
            await taskDal.insertOne(task2);

            // ACT
            const result = await taskDal.deleteMany(query);

            // ASSERT
            expect(result).toBeInstanceOf(Failure);
        });
    });
});
