'use strict';

const Task = require('./task-model');
const {ErrorResult} = require("../../common/result");
const {SuccessResult} = require("../../common/result");

const create = async data => {
    try {
        const savedTask = await new Task(data).save();
        return new SuccessResult({data: savedTask});
    } catch (error) {
        return new ErrorResult({message: 'Something went wrong. Please try again'});
    }
};

const findById = async ({id, select}) => {
    try {
        const task = await Task.findById(id, select);
        return new SuccessResult({data: task});
    } catch (error) {
        return new ErrorResult({message: `Couldn't find a Task with id ${id}`, status: 404});
    }
};

const findMany = ({query, select}) => Task.find(query, select);

const findOne = ({query, select}) => Task.findOne(query, select);

const updateOne = async ({query, value}) => {
    try {
        await Task.updateOne(query, value);
        const updatedTask = await findOne({query: query});
        return new SuccessResult({data: updatedTask});
    } catch (error) {
        return new ErrorResult({message: error});
    }
};

const updateMany = ({query, value}) => Task.updateMany(query, value);

const deleteOne = async query => {
    try {
        const result = await Task.deleteOne(query);
        if (result.deletedCount > 0) {
            return new SuccessResult({});
        }
        return new ErrorResult({message: `Couldn't find a Task`});
    } catch (error) {
        let message = 'Unable to delete Task';
        if (error.name === 'CastError') {
            message = `Couldn't find a Task.`;
        }

        return new ErrorResult({message: message});
    }
};

const deleteMany = query => Task.deleteMany(query);

module.exports = {
    create,
    findOne,
    findMany,
    findById,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany
};
