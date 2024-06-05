const { Submission } = require('../models/submission');

const submissionByCourse = async (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            const { courseName, email } = req.query;
            Submission.findOne({ email })
                .then(submission => {
                    if (!submission) {
                        resolve({statuscode:404 ,response:{ success: false, message: "No submission found" } });
                    } else {
                        const courseSubmission = submission.courses.get(courseName);
                        if (!courseSubmission) {
                            resolve({statuscode:404,response:{ success: false, message: "No submission found for the course" } });
                        } else {
                            resolve({statuscode:200,response:{ success: true, submission: courseSubmission } });
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                    reject({ success: false, message: "Error fetching submission" });
                });
        } catch (err) {
            console.error(err);
            reject({ success: false, message: "Error fetching submission" });
        }
    });
}

const submitTask = async (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            const { courseName, taskName, taskLink, email } = req.body;
            if(!courseName || !email || !taskName || !taskLink){
                return reject({ success: false, message: "Course name and email are required" });
            }
            Submission.findOne({ email })
                .then(submission => {
                    if (!submission) {
                        submission = new Submission({
                            email,
                            courses: { [courseName]: { tasks: [] } }
                        });
                    }

                    if (!submission.courses.get(courseName)) {
                        submission.courses.set(courseName, { tasks: [] });
                    }

                    if (submission.courses.get(courseName).tasks.find(task => task.taskName === taskName)) {
                       return reject({ success: false, message: "Task already submitted" });
                    }

                    submission.courses.get(courseName).tasks.push({
                        taskName,
                        taskLink,
                        status: "submitted",
                        submittedOn: new Date(),
                        feedback: ""
                    });

                    return submission.save();
                })
                .then(() => {
                    resolve({statuscode:200,response:{ success: true, message: "Task submitted successfully" }})
                })
                .catch(err => {
                    
                    reject({ success: false, message: "Error submitting task" });
                });
        } catch (err) {
            
            reject({ success: false, message: "Error submitting task" });
        }
    });
}

const updateTask = async (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            const { courseName, taskName, taskLink, email } = req.body;
            if(!courseName || !email || !taskName || !taskLink){
                return reject({ success: false, message: "Course name and email are required" });
            }
            Submission.findOne({ email })
                .then(submission => {
                    if (!submission || !submission.courses.get(courseName)) {
                       return  reject({ success: false, message: "No submission found" });
                    }

                    const taskIndex = submission.courses.get(courseName).tasks.findIndex(task => task.taskName === taskName);
                    if (taskIndex === -1){
                       return reject({ success: false, message: "Task not found" });
                    }
                    if(submission.courses.get(courseName).tasks[taskIndex].status === "approved"){
                       return reject({ success: false, message: "Task already approved" });
                    }

                    submission.courses.get(courseName).tasks[taskIndex] = {
                        taskName,
                        taskLink,
                        status: "submitted",
                        submittedOn: new Date(),
                        feedback: ""
                    };
                    return submission.save();
                })
                .then(() => {
                    resolve({statuscode:200,response:{ success: true, message: "Task updated successfully" }})
                })
                .catch(err => {
                    console.error(err);
                    reject({ success: false, message: "Error updating task" });
                });
        } catch (err) {
            console.error(err);
            reject({ success: false, message: "Error updating task" });
        }
    });
}
module.exports = { submissionByCourse, submitTask, updateTask };
