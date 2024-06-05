const router = require('express').Router();

const { pendingTasks, allTasks, updateTaskStatus } = require('../controllers/mentorController');

router.route('/pending-tasks').get(pendingTasks);
router.route('/all-tasks').get(allTasks);
router.route('/provide-feedback').post(updateTaskStatus);

module.exports = router;
