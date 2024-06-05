const router = require('express').Router();
const { getSubmissionsByCourseName, submitTask, updateTask } = require('../controllers/studentController');

router.route('/get-submissions').get(getSubmissionsByCourseName);
router.route('/submit-task').post(submitTask);
router.route('/update-task').post(updateTask);

module.exports = router;
