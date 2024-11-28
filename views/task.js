const express = require('express');
const { createTask, getTasks, updateTask, deleteTasks, getTask } = require('../controllers/task');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.route('/')
    .post(authenticate, createTask)
    .get(authenticate, getTasks)
    .delete(authenticate, deleteTasks);

router.route('/:id')
    .get(authenticate, getTask)
    .put(authenticate, updateTask);

module.exports = router;
