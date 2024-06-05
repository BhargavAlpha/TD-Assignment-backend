const {
  submissionByCourse,
  submitTask,
  updateTask,
} = require("../services/student");

exports.getSubmissionsByCourseName = (req, res) => {
  submissionByCourse(req, res)
    .then((result) => res.status(result.statuscode).json(result.response))
    .catch((err) => res.status(500).json(err));
};
exports.submitTask = (req, res) => {
  submitTask(req, res)
    .then((result) => res.status(result.statuscode).json(result.response))
    .catch((err) => res.status(500).json(err));
};
exports.updateTask = (req, res) => {
  updateTask(req, res)
    .then((result) => res.status(result.statuscode).json(result.response))
    .catch((err) => res.status(500).json(err));
};
