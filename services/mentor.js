const { Submission } = require("../models/submission");

function allTasks(req) {
    return new Promise((resolve, reject) => {
      const { courseName } = req.query;
      const page = parseInt(req.query.page);
      const order=req.query.sortOrder;
      const pageSize=20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      Submission.find()
        .then((submissions) => {
          let allTasksPromises = [];
          for (const submission of submissions) {
            if (submission.courses.get(courseName)) {
              for (const task of submission.courses.get(courseName).tasks) {
                  const emailPromise = Submission.aggregate([
                    { $match: { email: submission.email } },
                    { $project: { email: 1 } },
                  ]).then((emailAggregate) => {
                    const email =
                      emailAggregate.length > 0 ? emailAggregate[0].email : "";
                    return { task, email };
                  });
                  allTasksPromises.push(emailPromise);
              }
            }
          }
          return Promise.all(allTasksPromises);
        })
        .then((allTasks) => {
            if(order==='latest'){
                allTasks.sort((a,b)=>new Date(b.task.submittedOn)-new Date(a.task.submittedOn));
            }
            if(order==='oldest'){
                allTasks.sort((a,b)=>new Date(a.task.submittedOn)-new Date(b.task.submittedOn));
            }
            const numberOfPages = Math.ceil(allTasks.length / pageSize);
            allTasks=allTasks.slice(startIndex,endIndex);
          resolve({statuscode:200,response:{ success: true, allTasks,numberOfPages}});
        })
        .catch((err) => {
          console.error(err);
          reject({ success: false, message: err.message });
        });
    });
  }
function pendingTasks(req) {
    return new Promise((resolve, reject) => {
      const { courseName } = req.query;
      const page = parseInt(req.query.page);
      const order=req.query.sortOrder;
      const pageSize=20;
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
  
      Submission.find()
        .then((submissions) => {
          let pendingTasksPromises = [];
          for (const submission of submissions) {
            if (submission.courses.get(courseName)) {
              for (const task of submission.courses.get(courseName).tasks) {
                if (task.status === "submitted") {
                  const emailPromise = Submission.aggregate([
                    { $match: { email: submission.email } },
                    { $project: { email: 1 } },
                  ]).then((emailAggregate) => {
                    const email =
                      emailAggregate.length > 0 ? emailAggregate[0].email : "";
                    return { task, email };
                  });
                  pendingTasksPromises.push(emailPromise);
                }
              }
            }
          }
          return Promise.all(pendingTasksPromises);
        })
        .then((pendingTasks) => {
            if(order==='latest'){
                pendingTasks.sort((a,b)=>new Date(b.task.submittedOn)-new Date(a.task.submittedOn));
            }
            if(order==='oldest'){
                pendingTasks.sort((a,b)=>new Date(a.task.submittedOn)-new Date(b.task.submittedOn));
            }
            const numberOfPages = Math.ceil(pendingTasks.length / pageSize);
            pendingTasks=pendingTasks.slice(startIndex,endIndex);
          resolve({statuscode:200,response:{ success: true, pendingTasks,numberOfPages }});
        })
        .catch((err) => {
          console.error(err);
          reject({ success: false, message: err.message });
        });
    });
  }
async function updateTaskStatus(req, res) {
  return new Promise(async (resolve, reject) => {
    const { courseName, taskName, email, status, feedback, mentor } = req.body;
    if (!courseName || !taskName || !email || !status) {
      return resolve({statuscode:400,response:{ success: false, message: "Course name, task name, email and status are required" }})
    }
    try {
      const submission = await Submission.findOne({ email: email });
      if (!submission) {
        return resolve({statuscode:404,response:{ success: false, message: "Submission not found" }});
      }
      if (!submission.courses.get(courseName)) {
        return resolve({statuscode:404, response:{ success: false, message: "Course not found"} });
      }
      const taskIndex = submission.courses
        .get(courseName)
        .tasks.findIndex((task) => task.taskName === taskName);
      if (taskIndex === -1) {
        return resolve({statuscode:404,response:{ success: false, message: "Task not found" }})
      }
      if (
        submission.courses.get(courseName).tasks[taskIndex].status ===
        "approved"
      ) {
        return resolve({statuscode:400,response:{ success: false, message: "Task already approved" }})
      }
      if (
        submission.courses.get(courseName).tasks[taskIndex].status ===
        "rejected"
      ) {
        return resolve( {statuscode:400,response:{ success: false, message: "Task already rejected" }})
      }
      submission.courses.get(courseName).tasks[taskIndex].status = status;
      submission.courses.get(courseName).tasks[taskIndex].feedback = feedback;
      submission.courses.get(courseName).tasks[taskIndex].mentor = mentor;
      await submission.save().then(() => {
        resolve({statuscode:200,response:{ success: true, message: "Task status updated successfully" }});
      });
    } catch (err) {
      reject({ success: false, message: err.message });
    }
  });
}

module.exports = { allTasks, pendingTasks, updateTaskStatus };
