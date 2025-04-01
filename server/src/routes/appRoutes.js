const express = require('express');
const cpuUsageController = require('../controllers/cpuUsageController');
const router = express.Router();

router.get('/cpu-usage', cpuUsageController.getCpuUsageData);


module.exports = router;
