const express = require("express");
const router = express.Router();

router.use("/task", require("./apis/tasks.js"));
router.use("/goal", require("./apis/goals.js"));

module.exports = router;