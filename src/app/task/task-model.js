'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusTypes = ['Completed', 'Incomplete', 'InProgress'];

const task = new Schema(
    {
        title: {type: String, required: true},
        status: {
            type: String, required: true, enum: statusTypes,
        },
        note: {type: String},
    },
    {
        timestamps: {}
    }
);

module.exports = mongoose.model('Task', task);
