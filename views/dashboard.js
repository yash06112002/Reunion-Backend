const express = require('express');
const { getTasksInfo } = require('../controllers/dashboard');
const authenticate = require('../middlewares/auth');
const router = express.Router();

router.route('/').get(authenticate, getTasksInfo);

module.exports = router;