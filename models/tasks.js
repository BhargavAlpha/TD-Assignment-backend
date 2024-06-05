const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    taskLink: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['submitted', 'approved','rejected'], 
        default: 'submitted'
    },
    submittedOn: {
        type: Date,
        default: Date.now
    },
    feedback: String,
    mentor:{
        type: String,
        default: ''
    }
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
