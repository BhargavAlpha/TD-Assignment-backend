const mongoose = require('mongoose');
const Task = require('./tasks');

const CourseSchema = new mongoose.Schema({
    tasks: [Task.schema] 
}, { _id: false });

const SubmissionSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    courses: {
        type: Map,
        of: CourseSchema
    }
});

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = { Submission };
